Sending Message:

+ Have my actor id fetchable with public key
+ GET <username>@<host>
    + request webfinger from host for <username>
    + Find `href` from `rel: self` with `application/activity+json` type
    + GET the href (actor activity stream)
        + find user's inbox URL
        + Construct a activitystream of type note
        + Sign header with my private key to which the public ley is available inbox
          my actor activitystream
        + Make post request

Main activitystream has `image` and `icon` object with `url` in it.
+ image is the background banner
+ icon is the profile image