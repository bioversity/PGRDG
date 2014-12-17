var config = {
        "service": {
                "url": "http://gateway.grinfo.private/",
                "script": "Service.php",
                "proxy": "API/?type=service&proxy=",
                "definitions_dir": "/Service/Library/definitions",
                "path": {
                        "rsa": "common/include/conf/.rsa_keys/",
                        "gpg": "common/.gnupg/"
                }
        },
        "site": {
                "version": 1.5,
                "timestamp": 1414137020,
                "developer_mode": true,
                "default_language": "en",
                "allow_signup": false
        }
};
