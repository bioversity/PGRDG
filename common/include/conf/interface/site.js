/*
LEGEND:
service {
        url = The URL of the Service
        script = The name of the script of Ontology Wrapper API
        proxy = Local proxy URI
        definitions_dir = The local path of cloned Service's definitions. See the wiki for more info.
        path {
                rsa = The local path where all RSA keys will be stored
                gpg = The local path where all PGP keys will be stored
        }
        site {
                version = The version of the software (do not change)
                timestamp = The timestamp of last version publication date
                developer_mode = The site is in developer mode?
                default_language = The default language
                allow_signup = Allow or not user auto signup. If false, new users must be invited
                title = The first part of pages title
                html_title = The first part of pages title in html mode (for place in page contents)
                project_name = The Project name
        }
}
*/
var config = {
        "service": {
                "url": "http://THE_ONTOLOGY_WRAPPER_API_URL/",
                "script": "Service.php",
                "proxy": "API/?type=service&proxy=",
                "definitions_dir": "/Service/Library/definitions",
                "path": {
                        "rsa": "/.rsa_keys/",
                        "gpg": "/.gnupg/"
                }
        },
        "site": {
                "version": 1.5,
                "timestamp": 1414137020,
                "developer_mode": false,
                "default_language": "en",
                "allow_signup": false,
                "title": "PGRDG ~ Researching agricultural and forest biodiversity",
                "html_title": "<acronym title=\"Plant Genetic Resource Diversity Gateway\">PGRDG</acronym> ~ Researching agricultural and forest biodiversity",
                "project_name": "Plant Genetic Resource Diversity Gateway"
        }
};
