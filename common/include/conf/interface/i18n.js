var i18n = {};
i18n = {
        "en": {
                "maintenance": {
                        "title": "Under maintainance",
                        "message": "The Service is temporarily under maintainance.<br />This alert will close once the maintainance is over."
                },
                "messages": {
                        "map_limit_display": {
                                "title": "Displayed {N} of {TOT} markers",
                                "message": "The map cannot currently display more than {X} points.<br />This means that it contains only the first {X} points: this limitation will be resolved shortly, in the meanwhile, please reduce your selection."
                        },
                        "no_search_results": {
                                "title": "No data",
                                "message": "No results for this search"
                        }
                },
                "interface": {
                        "search_tips": "To search all occurrences of words, separate them with a space, for instance:<br /><kbd>Forest area managed for wood production</kbd> will select all records containing any of the following words: <i>forest</i>, <i>area</i>, <i>managed</i>, <i>wood</i> and <i>production</i>.<p>To search all occurrences matching a specific phrase, enclose it in double quotes <kbd><b style=\"color: #ff0000 !important;\">&quot;</b></kbd>, for instance:<br /><kbd><b style=\"color: #ff0000 !important;\">&quot;</b>forest area managed for wood production<b style=\"color: #ff0000 !important;\">&quot;</b></kbd> will select all records matching the full phrase.</p><p>To exclude a term from the results prefix it with a minus <kbd><b style=\"color: #ff0000 !important;\">-</b></kbd> sign, for instance:<br /><kbd>forest <b style=\"color: #ff0000 !important;\">-</b>wood</kbd> will select all records matching the word <i>forest</i> and not matching the word <i>wood</i>.</p><p>The same is true for phrases, for instance:<br /><kbd><b style=\"color: #ff0000 !important;\">-</b>&quot;research organization&quot; genebank</kbd> will select all records containing the word <i>genebank</i> but not the phrase <i>research organization</i>.</p><p>The search is case insensitive.</p>",
                        "map_search_place": "Searching \"{X}\"...",
                        "results_for": "Results for search \"{X}\"",
                        "advanced_search_info": "<span>&lsaquo;</span> Start typing the name of a field you want to search",
                        "static_form_help_text": "Fields you can use:",
                        "form_help_text": "Click on the green rectangle to activate the field: if you press the search button the system will select all data <em>containing</em> the selected field, regardless of its value.<br />To search for specific field values, fill the field search value or select the provided options."
                }
        }
};
