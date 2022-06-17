const Settings = require('../models/Settings');

class RedirectDeepLinkController {
    async redirectVeacos(req, res) {
        const { token } = req.query;
        return res.redirect("veacos://veacos/*" + token + "")
    }


}

module.exports = new RedirectDeepLinkController();
