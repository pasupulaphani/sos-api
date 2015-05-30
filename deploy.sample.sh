#set configs
heroku config:set \
TWILIO_ACCOUNT_SID='' \
TWILIO_AUTH_TOKEN='' \
TWILIO_FROM_NUMBER='' \
REST_ENDPOINT=''

git push heroku master
