import fs from "fs"
import path from "path"

export default function handler(req, res) {
    if (req.method === "POST") {
        try {
            // change the path to src/data/tasks.json
            const filePath = path.join(
                process.cwd(),
                "src",
                "data",
                "tasks.json"
            )
            let tasks = []

            // check if the file exists and create it if it doesn't
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, "[]", "utf8")
            }

            // read the file
            const fileData = fs.readFileSync(filePath, "utf8")

            try {
                tasks = JSON.parse(fileData)
            } catch (parseError) {
                console.error("خطأ في تحليل ملف JSON:", parseError)
                // if there is an error in parsing, reset the file to an empty array
                tasks = []
                fs.writeFileSync(filePath, "[]", "utf8")
            }

            // check if tasks is an array
            if (!Array.isArray(tasks)) {
                tasks = []
            }

            // add the new task with a unique id
            const newTask = {
                id: Date.now().toString(), // use the timestamp as a unique id
                ...req.body,
                createdAt: new Date().toISOString(),
            }
            tasks.push(newTask)

            // write the updated tasks to the file
            fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf8")

            res.status(200).json({
                message: "تمت إضافة المهمة بنجاح",
                task: newTask,
            })
        } catch (error) {
            console.error("خطأ في معالجة الطلب:", error)
            res.status(500).json({
                message: "حدث خطأ أثناء حفظ المهمة",
                error: error.message,
            })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
