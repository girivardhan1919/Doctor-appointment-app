# Doctor Appointment app

This microservice handles addition of problems and testcases along with solutions
for algocraft platform.
This service handles doctor appointment booking, fetching doctor appointments, cancel booking, and modifying appointment for the patients.

## Test Coverage
```
>80%
```

To set up the project on your local machine do the following steps:

1. Clone the project
```
git clone https://github.com/girivardhan1919/Doctor-appointment-app.git
```

2. Go inside the downloaded folder and install node modules

```
cd Doctor-appointment-app && npm install
```

3. Create a new .env file in the root directory and set the following env variables
```
PORT=6000
```

4. Start the backend server
```
npm run dev
```



### for running test
```
npm test
```

### To get test coverage
```
npx jest --coverage
```