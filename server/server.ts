import { app } from "./app";
import { PORT } from "./config/env.config";
import { checkDBConnection } from "./utils/db";

app.listen(PORT, () => {
    checkDBConnection()
    console.log(`Serving On Port ${PORT}`);

})