const user = require("../models/User");
function authenticate(req, res, next) {
  if (req.session.user && req.session.user.email) {
    user.findOne({ where: { email: req.session.user.email } })
      .then(usuario => {
        if (usuario) {
          req.session.iduser = usuario.iduser;
          return next();
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        console.error(err);
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
}

module.exports = authenticate