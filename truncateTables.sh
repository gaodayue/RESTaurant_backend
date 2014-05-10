#!/bin/bash
# Truncate database tables from console
DATABASE="restaurant"
DEFAULTS_FILE=$DATABASE.cnf

mysql --defaults-extra-file="$DEFAULTS_FILE" -Nse 'show tables' $DATABASE | while read table; do mysql --defaults-extra-file="$DEFAULTS_FILE" -e "truncate table $table" $DATABASE; done
