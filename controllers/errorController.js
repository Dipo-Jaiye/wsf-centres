module.exports = {
    notFound: (req,res) => {
        res.status(404).send("404 Not Found");
    },

    internalServerError: (err,req,res,next) => {
        if(err){
            console.error("Error occurred");
            console.error(err.message);
            res.status(500).send("500 Internal server error");
        }
    }
}