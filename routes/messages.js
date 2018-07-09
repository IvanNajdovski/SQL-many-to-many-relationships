const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req,res,next) =>{

        const message_and_tags = await db.query(
        `SELECT m.id, m.text, t.name
    FROM messages m
    JOIN messages_tags mt ON m.id=mt.message_id
    JOIN tags t ON mt.tag_id = t.id
    ORDER BY m.id`
    );
var startIdx = 0;
var messages = [];

for (var i = 0; i < message_and_tags.rows.length; i++) {
    var currentMessage = message_and_tags.rows[i];
    if (startIdx !== currentMessage.id) {
        startIdx = currentMessage.id;
        currentMessage.tags = [];
        currentMessage.tags.push(currentMessage.name);
        delete currentMessage.name;
        messages.push(currentMessage);
    } else {
        messages[startIdx - 1].tags.push(currentMessage.name);
    }
}
return res.send(messages);

});
router.post("/", async (req,res,next) =>{
    try{
        const result = await db.query(
            "INSERT INTO messages (text,id) VALUES ($1,$2) RETURNING *",
        [req.body.text, req.body.id]
    );
        return res.json(result.rows[0]);
    }catch(err){
        return next(err);
}
});
router.patch("/:id", async (req,res,next) => {
    try{
        const data = await db.query(
        "UPDATE messages SET text=$1 WHERE id=$2 RETURNING *",
        [req.body.text, req.params.id]
    );
return res.json(data.rows[0])
}catch(e){
    return next(e)
}
});
router.delete("/:id", async (req,res,next) => {
    try{
        const data = await db.query(
        "DELETE FROM messages WHERE id=$1 ",
        [req.params.id]
    );
return res.json({messages: "DELETED"})
}catch(e){
    return next(e)
}
});


module.exports = router;