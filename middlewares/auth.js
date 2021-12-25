var Auth = {
    check_login: function (req, res, next)
    {
        
        if (req.session.active == 0) {

            req.flash('info', 'Maaf, Anda tidak dapat mengakses halaman yang Anda tuju!');
            return res.redirect('/login');
        }

        if (!req.session.logged_in) {
            return res.redirect('/login');
        }

        next();
    },
    is_admin: function (req, res, next)
    {
        if (!req.session.role && req.session.role == 'user' && req.session.active == 1) {

            req.flash('info', 'Maaf, Anda tidak dapat mengakses halaman yang Anda tuju!');
            return res.redirect('/');
        }

        next();
    },
};


module.exports = Auth;