const express = require("express");

const db = require("../db");

const router = express.Router();


router.get("/", async (req,res,next)=>{

    const message_and_tags = await db.query(
        `SELECT t.id, t.name, m.text
     FROM tags t
	
       JOIN messages_tags mt ON t.id=mt.tag_id
	JOIN messages m ON mt.message_id = m.id
       
     ORDER BY t.id;`
    );
var startIdx = 0;
var messages = [];

for (var i = 0; i < message_and_tags.rows.length; i++) {
    var currentMessage = message_and_tags.rows[i];
    if (startIdx !== currentMessage.id) {
        startIdx = currentMessage.id;
        currentMessage.message = [];
        currentMessage.message.push(currentMessage.text);
        delete currentMessage.text;
        messages.push(currentMessage);
    } else {
        messages[startIdx - 1].message.push(currentMessage.text);
    }
}
return res.send(messages);

});

router.post("/", async (req,res,next) => {
    try{
        const data = await db.query("INSERT INTO tags (name,id) VALUES ($1,$2) RETURNING *",
        [req.body.name,req.body.id]);
        return res.json(data.rows[0])
    }catch(e){
        return next(e)
}
});
router.patch("/:id", async (req,res,next) => {
    try{
        const data = await db.query(
            "UPDATE tags SET name=$1 WHERE id=$2 RETURNING *",
        [req.body.name, req.params.id]
    );
        return res.json(data.rows[0])
    }catch(e){
        return next(e)
}
});
router.delete("/:id", async (req,res,next) => {
    try{
        const data = await db.query(
        "DELETE FROM tags WHERE id=$1 ",
        [req.params.id]
    );
return res.json({messages: "DELETED"})
}catch(e){
    return next(e)
}
});

module.exports = router;