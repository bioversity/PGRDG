# Site interface configuration files

Files listed in this directory are json files or json objects in javascript file.
Parameters are defined below.

## Site configuration
**Script**: `site.js`<br />
**Config behaviour**: loaded as object with variable `config`

### Parameters:
#### Service
| **Variable**          | **Type** | **Value**                                                                        |
| :-------------------- | :------- | :------------------------------------------------------------------------------- |
| `url`                 | string   | *Main URI of Service library<br />Note that is the path of `Service.php` script* |
| `script`              | string   | *The name of the script of Ontology Wrapper API*                                 |
| `proxy`               | string   | *Local call to the script for proxy calls.<br />Tipically is `API/?type=service&proxy=`<br />The interface will append parameters **after** this value*                            |
| `definitions_dir`     | string   | *The local path of cloned [Service definitions](https://github.com/bioversity/PGRDG-definitions). See [the wiki](https://github.com/bioversity/PGRDG/wiki/Installing-and-configuring) for more info*                             |

##### Path
| **Variable**          | **Type** | **Value**                                                                        |
| :-------------------- | :------- | :------------------------------------------------------------------------------- |
| `rsa`                 | string   | *The local path where all RSA keys will be stored*                               |
| `gpg`                 | string   | *The local path where all PGP keys will be stored*                               |

#### Site
|  **Variable**         | **Type** | **Value**                                                                        |
| :-------------------- | :------- | :------------------------------------------------------------------------------- |
| `version`             | int      | *The version of the software (do not change)*                                    |
| `timestamp`           | int      | *The timestamp of last data version.<br />This data will be changed by Ontology Wrapper.<br />Its changing will cause the storage refresh of all client*                                              |
| `developer_mode`      | bool     | *If true display all outputs to debug console and also add a field for development purposes to the main menu*                                                                                            |
| `default_language`    | string   | *Default language.<br />Note that you need i18n.js file well configured*         |
| `allow_signup`        | bool     | *Allow or not user auto signup. If false, new users must be invited*             |
| `title`               | string   | *The first part of pages title*                                                  |
| `html_title`          | string   | *The first part of pages title in HTML mode (for place in page contents)*        |
| `project_name`        | string   | *The Project name (can be in HTML)*                                              |


***

## Site maintainance
**Script**: `maintainance.json`<br />
**Config behaviour**: called asynchronous
Use when you need to operate in production site.<br />If true, the site will freeze and show a message until is false.<br />A timeout function will automatically control changes.

|  **Variable**               | **Type** | **Value** |
| :-------------------------- | :------- | :-------- |
| `status`                    | bool     | *If true the site is in maintainance mode* |
| `check_time -> true_state`  | int      | *Time in millisecond during each call when site is in maintainance mode* |
| `check_time -> false_state` | int      | *Time in millisecond during each call when site is NOT in maintainance mode* |

***

## Languages configuration
**Script**: `i18n.js`<br />
**Config behaviour**: loaded as object with variable `i18n`

If you want to add another language simply copy the `i18n["en"]` object and add one more with your translation.<br />
Replace *`en`* with the language Country code.
