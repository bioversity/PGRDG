<?php

/**
* Encoder.php
*
* This file contains the definition of the {@link Encoder} class.
*/

namespace OntologyWrapper;
if(!defined("SYSTEM_ROOT")) {
	define("SYSTEM_ROOT", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR);
}

/*=======================================================================================
*																						*
*										Encoder.php										*
*																						*
*======================================================================================*/

/**
* Encryption library.
*
* These refer to the encryption library.
*/
require_once( SYSTEM_ROOT . "common/include/lib/phpseclib/Crypt/RSA.php" );
require_once( SYSTEM_ROOT . "common/include/lib/phpseclib/Math/BigInteger.php" );

/**
* Encoder object
*
* This class can be used to encode and decode data, as well as to get private and public
* keys.
*
* The class features the following methods:
*
* <ul>
*	<li>tt>cypherMode()</tt>: Set or retrieve cypher mode.
*	<li>tt>keySize()</tt>: Set or retrieve key bits size.
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
	* Key size.
	*
	* This data member holds the key size.
	*
	* @var int
	*/
	protected $mKeySize = NULL;



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
	* @param int					$theSize			Key size.
	*
	* @access public
	*
	* @uses cypherMode()
	* @uses keySize()
	*/
	public function __construct( $theMode = CRYPT_RSA_ENCRYPTION_PKCS1, $theSize = 2048 )
	{
		//
		// Set mode.
		//
		$this->cypherMode( $theMode );

		//
		// Set key size.
		//
		$this->keySize( $theSize );

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
	* integer parameter that must be either the mode, or <tt>NULL</tt> to retrieve the
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
				case CRYPT_RSA_ENCRYPTION_OAEP:
				case CRYPT_RSA_ENCRYPTION_PKCS1:
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
	*	keySize																			*
	*==================================================================================*/

	/**
	* Manage key size
	*
	* This method can be used to manage the key size, the method expects a single
	* integer parameter, or <tt>NULL</tt> to retrieve the current value.
	*
	* @param mixed					$theValue			Operation or size.
	*
	* @access public
	* @return int					The current size.
	*
	* @throws Exception
	*/
	public function keySize( $theValue = NULL )
	{
		//
		// Set mode.
		//
		if( $theValue !== NULL )
		$this->mKeySize = (int) $theValue;

		return $this->mKeySize;														// ==>

	} // keySize.



	/*=======================================================================================
	*																						*
	*								PUBLIC KEYGEN INTERFACE									*
	*																						*
	*======================================================================================*/



	/*===================================================================================
	*	generateKeys																	*
	*==================================================================================*/

	/**
	* Generate keys
	*
	* This method can be used to encode the provided data with the external public key.
	*
	* The method will return the data as a base 64 encoded string.
	*
	* @param string			   &$thePublic			Receives public key.
	* @param string			   &$thePrivate			Receives private key.
	*
	* @access public
	*/
	public function generateKeys( &$thePublic, &$thePrivate )
	{
		//
		// Conficure.
		//
		$crypter = new \Crypt_RSA();
		$crypter->setPrivateKeyFormat( CRYPT_RSA_PRIVATE_FORMAT_PKCS1 );
		$crypter->setPublicKeyFormat( CRYPT_RSA_PUBLIC_FORMAT_PKCS1 );

		//
		// Create keys.
		//
		$keys = $crypter->createKey( $this->keySize() );

		//
		// Check keys.
		//
		if( $keys[ 'partialkey' ] )
		throw new \Exception(
		"Partial keys." );												// !@! ==>

		//
		// Set keys.
		//
		$thePublic = $keys[ 'publickey' ];
		$thePrivate = $keys[ 'privatekey' ];

	} // generateKeys.



	/*=======================================================================================
	*																						*
	*								PUBLIC CYPHER INTERFACE									*
	*																						*
	*======================================================================================*/



	/*===================================================================================
	*	encodeData																		*
	*==================================================================================*/

	/**
	* Encode data
	*
	* This method can be used to encode the provided data with the external public key.
	*
	* The method will return the data as a base 64 encoded string.
	*
	* @param string				$theData			Data to encode.
	*
	* @access public
	* @return string				Encoded data.
	*
	* @uses publicEncode()
	*/
	public function encodeData( $theData )
	{
		$tmp = explode( '/', kPATH_LIBRARY_ROOT );
		return $this->publicEncode(
		$theData,
		file_get_contents(
		implode( '/',
		array_merge(
		array_splice(
		$tmp,
		0,
		count( $tmp ) - 3 ),
		array( 'Private',
		kPORTAL_PREFIX,
		'ext_pub.pem' ) ) ) ) );				// ==>

	} // encodeData.


	/*===================================================================================
	*	decodeData																		*
	*==================================================================================*/

	/**
	* Decode data
	*
	* This method can be used to decode the provided data with the local private key.
	*
	* The method will return the data as a plain string.
	*
	* @param string				$theData			Data to decode.
	*
	* @access public
	* @return string				Decoded data.
	*
	* @uses privateDecode()
	*/
	public function decodeData( $theData )
	{
		$tmp = explode( '/', kPATH_LIBRARY_ROOT );
		return $this->privateDecode(
		$theData,
		file_get_contents(
		implode( '/',
		array_merge(
		array_splice(
		$tmp,
		0,
		count( $tmp ) - 3 ),
		array( 'Private',
		kPORTAL_PREFIX,
		'priv.pem' ) ) ) ) );				// ==>

	} // decodeData.



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
	* expects the data to be encoded and the public key used to crypt the data; the method
	* will return the crypted data as a base 64 encoded string.
	*
	* @param string				$theData			Data to encode.
	* @param string				$theKey				Public key.
	*
	* @access public
	* @return string				Encoded data (base 64).
	*
	* @uses encode()
	*/
	public function publicEncode( $theData, $theKey )
	{
		return
		base64_encode(
		$this->encode( $theData, $theKey ) );								// ==>

	} // publicEncode.


	/*===================================================================================
	*	privateDecode																	*
	*==================================================================================*/

	/**
	* Decode data with private key
	*
	* This method can be used to decode the provided data with a private key, the method
	* expects the data to be decoded as a base 64 encoded string and the private key; the
	* method will return a string holding the decoded data in plain text.
	*
	* @param string				$theData			Data to decode (in base 64).
	* @param string				$theKey				Private key.
	*
	* @access public
	* @return string				Decoded data.
	*
	* @uses decode()
	*/
	public function privateDecode( $theData, $theKey )
	{
		return
		$this->decode(
		base64_decode( $theData ), $theKey );								// ==>

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
	* This method is used to encode data.
	*
	* @param string				$theData			Data to encode.
	* @param string				$theKey				Public key.
	*
	* @access public
	* @return string				Encoded data (binary).
	*/
	protected function encode( $theData, $theKey )
	{
		//
		// Conficure.
		//
		$crypter = new \Crypt_RSA();

		//
		// Load key.
		//
		if( $crypter->loadKey( $theKey ) )
		{
			//
			// Set mode.
			//
			$crypter->setEncryptionMode( $this->cypherMode() );

			return $crypter->encrypt( (string) $theData );							// ==>

		} // Loaded key.

		throw new \Exception(
		"Unable to load key." );											// !@! ==>

	} // encode.


	/*===================================================================================
	*	decode																			*
	*==================================================================================*/

	/**
	* Decode data
	*
	* This method is used to decode data.
	*
	* @param string				$theData			Data to decode.
	* @param string				$theKey				Private key.
	*
	* @access public
	* @return string				Decoded data.
	*/
	protected function decode( $theData, $theKey )
	{
		//
		// Conficure.
		//
		$crypter = new \Crypt_RSA();

		//
		// Load key.
		//
		if( $crypter->loadKey( $theKey ) )
		{
			//
			// Set mode.
			//
			$crypter->setEncryptionMode( $this->cypherMode() );

			return $crypter->decrypt( (string) $theData );							// ==>

		} // Loaded key.

		throw new \Exception(
		"Unable to load key." );											// !@! ==>

	} // decode.



} // class Encoder.


?>
