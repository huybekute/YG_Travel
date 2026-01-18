// import connection from "./config/db.js"
import express from "express"
import cors from "cors"
import userRoutes from "./src/routes/userRoutes.js"
import provinceRoutes from  "./src/routes/provinceRoutes.js"
import categoryRoutes from "./src/routes/categoryRoutes.js"
import locationRoutes from "./src/routes/locationRoutes.js"
import imageLocationRoutes from "./src/routes/imageLocationRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/province', provinceRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/image', imageLocationRoutes)

const PORT = process?.env?.PORT ?? 3000
app.listen(PORT, () => {
    console.log('Thanh cong');
});