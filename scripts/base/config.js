define(function () {
    var config = {
        mode : 'develop',
        root : {
            site : 'm.kgcrm.net',
            api  : 'api.kgcrm.net',
            cdn : '7ximo5.com1.z0.glb.clouddn.com',
            cdnAvatar : '7xj1dh.com1.z0.glb.clouddn.com'
        },
    };

    // if (location.host === 'm.kgcrm.net') {
    //     config.mode = 'release';
    // }

    return config;
});