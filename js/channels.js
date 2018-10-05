console.log("Channels.js is alive");

/** Constructor for the channels */
function Channel(n,d,c,s,e,m){
    this.name = n;
    this.createdOn = d;
    this.createdBy = c;
    this.starred = s;
    this.expiresIn = e;
    this.messageCount = m;
    this.messages = [];
}

/** #7 #chlob #new: the new yummy channel */
var yummy = new Channel('#Yummy',new Date(2016,3,1),'minus.plus.yummy',false,100,999);

/** #7 #chlob #fve: the other channels */
var sevenContinents = new Channel('#SevenContinents',new Date(2016,3,2),'cheeses.yard.applies',true,60,5);
var killerApp = new Channel('#KillerApp',new Date(2016,8,30),'lodge.bits.fake',false,1,10351);
var firstPersonOnMars = new Channel('#FirstPersonOnMars',new Date(2016,8,28),'snipped.atom.grid',true,3003,2424);
var octoberFest = new Channel('#OctoberFest',new Date(2016,8,25),'vocally.clearly.crawled',false,60,321);

var channels = [yummy, sevenContinents, killerApp, firstPersonOnMars, octoberFest];
