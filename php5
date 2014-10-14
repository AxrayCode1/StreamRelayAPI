# /etc/cron.d/php5: crontab fragment for php5
#  This purges session files older than X, where X is defined in seconds
#  as the largest value of session.gc_maxlifetime from all your php.ini
#  files, or 24 minutes if not defined.  See /usr/lib/php5/maxlifetime

# Look for and purge old sessions every 30 minutes
12,42 *     * * *     root   [ -x /usr/lib/php/maxlifetime ] && [ -d /var/lib/php/session ] && find /var/lib/php/session -depth -mindepth 1 -maxdepth 1 -type f -ctime +1 -delete
*/5 *     * * *     root   find /var/lib/php/session -cmin +5 -name "sess_*" -and -size 0 -delete > /dev/null 2>&1
