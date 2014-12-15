<?php

/**
 * Encoder.php
 *
 * This file contains the definition of the {@link Encoder} class.
 */

namespace OntologyWrapper;

/*=======================================================================================
 *																						*
 *										Encoder.php										*
 *																						*
 *======================================================================================*/

/**
 * Encoder object
 *
 * This class can be used to encode and decode data, as well as to get private and public
 * keys.
 *
 * The class features the following methods:
 *
 * <ul>
 *	<li>tt>cypherMode()</tt>: Set or retrieve cypher mode, the value must be among the
 *		openSSL (http://php.net/manual/en/openssl.ciphers.php) cyphers, defaults to
 *		{@link OPENSSL_CIPHER_AES_256_CBC}.
 *	<li>tt>blockSize()</tt>: Set or retrieve block size, defaults to 2048.
 *	<li>tt>generateKeys()</tt>: Generate public and private keys.
 *	<li>tt>generateFingerprint()</tt>: Generate PGP fingerprint.
 *	<li>tt>publicEncode()</tt>: Encode data with public key.
 *	<li>tt>privateEncode()</tt>: Encode data with private key.
 *	<li>tt>publicDecode()</tt>: Decode data with public key.
 *	<li>tt>privateDecode()</tt>: Decode data with private key.
 * </ul>
 *
 *	@author		Milko A. Škofič <m.skofic@cgiar.org>
 *	@version	1.00 11/12/2014
 */
class Encoder
{
	/**
	 * Encoding mode.
	 *
	 * This data member holds the cypher mode.
	 *
	 * @var int
	 */
	protected $mMode = NULL;

	/**
	 * Block size.
	 *
	 * This data member holds the encoding block size.
	 *
	 * @var int
	 */
	protected $mSize = NULL;



/*=======================================================================================
 *																						*
 *										MAGIC											*
 *																						*
 *======================================================================================*/



	/*===================================================================================
	 *	__construct																		*
	 *==================================================================================*/

	/**
	 * Instantiate class.
	 *
	 * The constructor requires the encoding mode, the RSA mode is default.
	 *
	 * @param int					$theMode			Cypher mode.
	 * @param int					$theSize			Block size.
	 *
	 * @access public
	 *
	 * @uses cypherMode()
	 * @uses blockSize()
	 */
	public function __construct( $theMode = OPENSSL_CIPHER_AES_256_CBC, $theSize = 2048 )
	{
		//
		// Set mode.
		//
		$this->cypherMode( $theMode );

		//
		// Set size.
		//
		$this->blockSize( $theSize );

	} // Constructor.



/*=======================================================================================
 *																						*
 *							PUBLIC MEMBER ACCESSOR METHODS								*
 *																						*
 *======================================================================================*/



	/*===================================================================================
	 *	cypherMode																		*
	 *==================================================================================*/

	/**
	 * Manage cypher mode
	 *
	 * This method can be used to manage the cypher mode, the method expects a single
	 * integer parameter that must be among the openSSL predefined constants
	 * (http://php.net/manual/en/openssl.ciphers.php), or <tt>NULL</tt> to retrieve the
	 * current value.
	 *
	 * @param mixed					$theValue			Operation or mode.
	 *
	 * @access public
	 * @return int					The current mode.
	 *
	 * @throws Exception
	 */
	public function cypherMode( $theValue = NULL )
	{
		//
		// Set mode.
		//
		if( $theValue !== NULL )
		{
			//
			// Check mode.
			//
			switch( $theValue )
			{
				case OPENSSL_CIPHER_RC2_40:
				case OPENSSL_CIPHER_RC2_128:
				case OPENSSL_CIPHER_RC2_64:
				case OPENSSL_CIPHER_DES:
				case OPENSSL_CIPHER_3DES:
				case OPENSSL_CIPHER_AES_128_CBC:
				case OPENSSL_CIPHER_AES_192_CBC:
				case OPENSSL_CIPHER_AES_256_CBC:
					$this->mMode = (int) $theValue;
					break;

				default:
					throw new \Exception(
						"Invalid or unsupported mode [$theValue]." );			// !@! ==>
			}

		} // Provided new mode.

		return $this->mMode;														// ==>

	} // cypherMode.


	/*===================================================================================
	 *	blockSize																		*
	 *==================================================================================*/

	/**
	 * Manage block size
	 *
	 * This method can be used to manage the block size, the method expects a single
	 * integer parameter, or <tt>NULL</tt> to retrieve the current value.
	 *
	 * @param mixed					$theValue			Operation or size.
	 *
	 * @access public
	 * @return int					The current size.
	 *
	 * @throws Exception
	 */
	public function blockSize( $theValue = NULL )
	{
		//
		// Set mode.
		//
		if( $theValue !== NULL )
			$this->mSize = (int) $theValue;

		return $this->mSize;														// ==>

	} // blockSize.



/*=======================================================================================
 *																						*
 *								PUBLIC ENCODING INTERFACE								*
 *																						*
 *======================================================================================*/



	/*===================================================================================
	 *	publicEncode																	*
	 *==================================================================================*/

	/**
	 * Encode data with public key
	 *
	 * This method can be used to encode the provided data with a public key, the method
	 * expects the data to be encoded and the key used to crypt the data; the method will
	 * return a string holding the encoded data.
	 *
	 * The method will return the data as a base 64 encoded string.
	 *
	 * @param string				$theData			Data to encode.
	 * @param string				$theKey				Encoding public key.
	 *
	 * @access public
	 * @return string				Encoded data.
	 *
	 * @uses encode()
	 */
	public function publicEncode( $theData, $theKey )
	{
		//
		// Init local storage.
		//
		$size = $this->blockSize();

		//
		// Encode.
		//
		$theData = $this->encode( $theData, $theKey, $size, FALSE );

		return base64_encode( $theData );											// ==>

	} // publicEncode.


	/*===================================================================================
	 *	publicDecode																	*
	 *==================================================================================*/

	/**
	 * Decode data with public key
	 *
	 * This method can be used to decode the provided data with a public key, the method
	 * expects the data to be decoded and the key used to crypt the data; the method will
	 * return a string holding the decoded data.
	 *
	 * The method expects a base 64 encoded string and will return the data as a plain text
	 * string.
	 *
	 * @param string				$theData			Data to dencode.
	 * @param string				$theKey				Encoding public key.
	 *
	 * @access public
	 * @return string				Encoded data.
	 *
	 * @uses decode()
	 */
	public function publicDecode( $theData, $theKey )
	{
		//
		// Init local storage.
		//
		$size = $this->blockSize();

		return $this->decode( base64_decode( $theData ), $theKey, $size, FALSE );	// ==>

	} // publicDecode.


	/*===================================================================================
	 *	privateEncode																	*
	 *==================================================================================*/

	/**
	 * Encode data with private key
	 *
	 * This method can be used to encode the provided data with a private key, the method
	 * expects the data to be encoded and the key used to crypt the data; the method will
	 * return a string holding the encoded data.
	 *
	 * The method will return the data as a base 64 encoded string.
	 *
	 * @param string				$theData			Data to encode.
	 * @param string				$theKey				Encoding private key.
	 *
	 * @access public
	 * @return string				Encoded data.
	 *
	 * @uses encode()
	 */
	public function privateEncode( $theData, $theKey )
	{
		//
		// Init local storage.
		//
		$size = $this->blockSize();

		//
		// Encode.
		//
		$theData = $this->encode( $theData, $theKey, $size, TRUE );

		return base64_encode( $theData );											// ==>

	} // privateEncode.


	/*===================================================================================
	 *	privateDecode																	*
	 *==================================================================================*/

	/**
	 * Decode data with private key
	 *
	 * This method can be used to decode the provided data with a private key, the method
	 * expects the data to be decoded and the key used to crypt the data; the method will
	 * return a string holding the decoded data.
	 *
	 * The method expects a base 64 encoded string and will return the data as a plain text
	 * string.
	 *
	 * @param string				$theData			Data to dencode.
	 * @param string				$theKey				Encoding provate key.
	 *
	 * @access public
	 * @return string				Encoded data.
	 *
	 * @uses decode()
	 */
	public function privateDecode( $theData, $theKey )
	{
		//
		// Init local storage.
		//
		$size = $this->blockSize();

		return $this->decode( base64_decode( $theData ), $theKey, $size, TRUE );	// ==>

	} // privateDecode.



/*=======================================================================================
 *																						*
 *								PROTECTED ENCODING INTERFACE							*
 *																						*
 *======================================================================================*/



	/*===================================================================================
	 *	encode																			*
	 *==================================================================================*/

	/**
	 * Encode data
	 *
	 * This method is used to encode data by the public methods, its main duty is to
	 * differentiate encoding from private and public keys.
	 *
	 * @param string				$theData			Data to encode.
	 * @param string				$theKey				Encoding key.
	 * @param int					$theSize			Encoding size.
	 * @param boolean				$isPrivate			<tt>TRUE</tt> private key.
	 *
	 * @access public
	 * @return string				Encoded data.
	 */
	public function encode( $theData, $theKey, $theSize, $isPrivate = FALSE )
	{
		//
		// Init local storage.
		//
		$encrypted = '';

		//
		// Cycle data.
		//
		while( $theData )
		{
			//
			// Slice.
			//
			$slice = substr( $theData, 0, $theSize );
			$theData = substr( $theData, $theSize );

			//
			// Encrypt.
			//
			if( $isPrivate )
				$ok = openssl_private_encrypt( $slice, $block, $theKey );
			else
				$ok = openssl_public_encrypt( $slice, $block, $theKey );

			//
			// Append.
			//
			if( $ok )
				$encrypted .= $block;
			else
				throw new \Exception(
					"Error encoding value." );									// !@! ==>

		} // Cycling data.

		return $encrypted;															// ==>

	} // decode.


	/*===================================================================================
	 *	decode																			*
	 *==================================================================================*/

	/**
	 * Decode data
	 *
	 * This method is used to decode data by the public methods, its main duty is to
	 * differentiate encoding from private and public keys.
	 *
	 * @param string				$theData			Data to decode.
	 * @param string				$theKey				Encoding key.
	 * @param int					$theSize			Encoding size.
	 * @param boolean				$isPrivate			<tt>TRUE</tt> private key.
	 *
	 * @access public
	 * @return string				Decoded data.
	 */
	public function decode( $theData, $theKey, $theSize, $isPrivate = FALSE )
	{
		//
		// Init local storage.
		//
		$decrypted = '';

		//
		// Cycle data.
		//
		while( $theData )
		{
			//
			// Slice.
			//
			$slice = substr( $theData, 0, $theSize );
			$theData = substr( $theData, $theSize );

			//
			// Decrypt.
			//
			if( $isPrivate )
				$ok = openssl_private_decrypt( $slice, $block, $theKey );
			else
				$ok = openssl_public_decrypt( $slice, $block, $theKey );

			//
			// Append.
			//
			if( $ok )
				$decrypted .= $block;
			else
				throw new \Exception(
					"Error decoding value." );									// !@! ==>

		} // Cycling data.

		return $decrypted;															// ==>

	} // decode.



} // class Encoder.


?>
