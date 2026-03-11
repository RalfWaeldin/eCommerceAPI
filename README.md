Env variablen:

MONGO_URI: MongoDB connection string
examle: mongodb://<user>>:<password>@127.0.0.1:27017/<db name>?authSource=admin&replicaSet=rs0

DB_NAME: name of the database
examle: eCommerce

PORT: port id of the backend
example: 3000

ACCESS_JWT_SECRET: string to be used for the hashing algorythm

SALT_ROUNDS: delay for the hashing algorythm (integer value)

JWT_EXPIRATION_TIME: expiration duration
example: 15min

CLIENT_BASE_URL= url to the front end

LOGFILEDIR: directory for the log files
example: public/LOGFILES

LOGLEVEL: level for writing log files
<= 0: logging off
= 1 : logging errors
= 2 : additional logging of component information (includes errors) >= 3: debug logging (includes component and error logging)
