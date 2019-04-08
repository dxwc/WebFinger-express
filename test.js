let get = require('./get.js');

get.activitystream(`https://hostux.social/@liofilizado_`)
.then((res) =>
{
    console.log(res);
    return get.activitystream(`rosjackson@wandering.shop`);
})
.then((res) =>
{
    console.log(res);
})
.catch((err) =>
{
    console.error('Error:', err);
})