const express = require('express');
const userRouter = require('./routers/userRouter');
const expenseRouter = require('./routers/expenseRouter');
const incomeRouter = require('./routers/incomeRouter');
require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is running at port '+port);
})

app.use(express.json());
app.use(userRouter);
app.use(expenseRouter);
app.use(incomeRouter);