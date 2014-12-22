<?php
/* example jCryption entry point - will handle handshake, getPublicKey,
 * decrypttest or a dump of posted form variables.
 * Key files specified below should be stored outside the web tree
 * but for the example they are not.
 *
 * To generate keys:
 *
 * openssl genrsa -out rsa_1024_priv.pem 1024
 * openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
 */

require_once 'include/sqAES.php';
require_once 'include/JCryption.php';

$jc = new JCryption($_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_pub.pem", $_SERVER["DOCUMENT_ROOT"] . DIRECTORY_SEPARATOR . "common/include/conf/.rsa_keys/rsa_2048_priv.pem");
$jc->go();
header('Content-type: text/plain');
print_r($_POST);
