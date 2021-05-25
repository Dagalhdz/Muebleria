module.exports = {
   isLoggedIn(req, res, next){
      if (req.isAuthenticated()) {
         return next();
      }
      return res.redirect('/signin');
   },

   isNotLoggedIn(req, res, next) {
      if(!req.isAuthenticated()){
         return next();
      }
      return res.redirect('/ventas');
   },

   isAdmin(req, res, next){
      if(req.user.id_rol == 2){
         return next();
      }
      return res.redirect('/ventas');
   }
}