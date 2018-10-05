/* start the external action and say hello */
console.log("Script.js is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the first channel  */
currentChannel = channels[0];

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    $('#chat h1').empty();

    $('<span>').attr('id', 'channel-name').html(channelObject.name).appendTo($('#chat h1'));

    $('<small>').attr('id', 'channel-location').appendTo($('#chat h1'));

    $('#channel-location').html(' by <a href="http://w3w.co/'+channelObject.createdBy+'" target="_blank"><strong>'+channelObject.createdBy+'</strong></a>');

    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').attr('onclick', 'star()').appendTo($('#chat h1'));


    // #7  Write the new channel to the right app bar using object property
    /*document.getElementById('channel-name').innerHTML = channelObject.name;*/
    //$('#channel-name').html(channelObject.name);

    //#7  change the channel location using object property
    /*document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';*/

    //$('#channel-location').html('by <a href="http://w3w.co/'+channelObject.createdBy+'" target="_blank"><strong>'+channelObject.createdBy+'</strong></a>');

    /* #7 remove either class */
    //$('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    //$('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
}

function loadEmojis() {
    $('#emojis').append(require('emojis-list'));
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    if ($('#message').val()==""){
        return;
    }

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());

    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');


    currentChannel.messages.push(message);
    currentChannel.messageCount++;
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent-button">+5 min.</button>' +
        '</div>';
}


function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    if (criterion==1){
        channels.sort(compareDate);
    }else if (criterion==2){
        channels.sort(compareMessages);
    }else if (criterion==3){
        channels.sort(compareMessages);
        channels.sort(compareStar);
    }
    
    $('#channels ul').empty();

    var i=0;
    while (i<channels.length){
        $('#channels ul').append(createChannelElement(channels[i]));
        i++;
    }

    // #8 five new channels
    /*$('#channels ul').append(createChannelElement(yummy));
    $('#channels ul').append(createChannelElement(sevencontinents));
    $('#channels ul').append(createChannelElement(killerapp));
    $('#channels ul').append(createChannelElement(firstpersononmars));
    $('#channels ul').append(createChannelElement(octoberfest));*/


    /* Selecting one channel when loading */
    switchChannel(channels[0]);    
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    /* Fixing faulty code */
    var channelName = channelObject.name.slice(1,channelObject.name.length);
    channelName = channelName.charAt(0).toLowerCase()+ channelName.slice(1,channelName.length);
    var channel = $('<li onclick="switchChannel('+channelName+')">').text(channelObject.name);

    // create a channel
    //var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}

function compareDate(ch1, ch2) {
    var d1 = ch1.createdOn;
    var d2 = ch2.createdOn;

    if (d1 > d2) {
        return -1;
    } else {
        return 1;
    }
}

function compareMessages(ch1,ch2){
    var m1 = ch1.messageCount;
    var m2 = ch2.messageCount;

    if (m1 > m2) {
        return -1;
    } else {
        return 1;
    }
}

function compareStar(ch1,ch2){
    var s1 = (ch1.starred) ? 1 : 0;
    var s2 = (ch2.starred) ? 1 : 0;

    if (s1 > s2) {
        return -1;
    } else {
        return 1;
    }
}


function newChannel(){
    $('#messages').empty();

    $('#chat h1').empty();

    $('<input>').attr('type', 'text').attr('placeholder','Enter a #ChannelName').attr('maxlength','140').attr('id','newChannel').appendTo($('#chat h1'));
    $('<button>').attr('id','abort-button').attr('onclick','abortNewChannel()').addClass('primary-button strong').html('<i class="fas fa-times"></i> ABORT').appendTo($('#chat h1'));

    $('#send-button').empty().removeAttr('onclick').attr('onclick','createNewChannel()').html('CREATE');
}

function createNewChannel(){

    var channelNewName = $('#newChannel').val();
    var message = $('#message').val();

    if (channelNewName==""){
        return;
    }else if (channelNewName.charAt(0)!="#"){
        return;
    }else if (!noSpaces(channelNewName)){
        return;
    }

    if (message==""){
        return;
    }

    console.log('89898');
    var nc = new Channel(channelNewName,new Date(),currentLocation.what3words,false,15,0);
    channels.push(nc);

    currentChannel = nc;
    sendMessage();

    console.log(currentChannel);

    $('#newChannel').val('');

    abortNewChannel();

    listChannels(1);
}

function abortNewChannel(){

    $('#chat h1').empty();
    switchChannel(currentChannel);
    $('#send-button').empty().removeAttr('onclick').attr('onclick','sendMessage()').html('<i class="fas fa-arrow-right"></i>');
}

function noSpaces(thingy){
    var l=thingy.length;
    var i=0;
    while (i<l){
        if (thingy.charAt(i)==' '){
            return false;
        }
        i++;
    }
    return true;
}