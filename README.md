# ThePirateBay REST API using NodeJS

<p><strong>ThePirateBay REST API in NodeJS that spits back JSON data.</strong></p>

## Configuration

### Searching

<p>The URL</p>

<http://localhost:5000/search/:query?page=1&sort=7&category=0>

<ul id="list">
	<li id="query"><strong>:query</strong> = The seaching keyword</li>
	<li ><strong>:page</strong> = Page Number</li>
	<li id="sort"><strong>:sort</strong> = Sort By:
		<ol>
			<li>Type = 13 Audio-Other, 14 Other-Audios</li>
      <li>Name = 1 a-z, 2 z-a</li>
			<li>Uploaded = 3 Latest, 4 Oldest</li>
			<li>Size = 5 Largest, 6 Least</li>
			<li>Uploader = 11 a-z, 12 z-a</li>
			<li>Seeds = 7 Most, 8 Least</li>
			<li>Leechers = 8 Most, 9 Least</li>
		</ol>
	</li>
	<li><strong>:category</strong> =
		<ol><strong>1. Audio = 100</strong>
			<ol>
				<li>Music = 101</li>
        <li>Audio Books = 102</li>																		<li>Sound Clips = 103</li>
			  <li>FLAC = 104</li>
			  <li>Other = 199</li></ol>
		</ol>
         </li>
  <li>
    <ol>
      <strong>2. Video = 200</strong>
      <ol>
        <li>Movies = 201</li>
        <li>Movies DVDR = 202</li>
        <li>Music Videos = 203</li>
        <li>Movie Clips = 204</li>
        <li>TV Shows = 205</li>
        <li>Handheld = 206</li>
        <li>HD - Movies = 207</li>
        <li>HD - TV Shows = 208</li>
        <li>3D = 209</li>
        <li>Other = 299</li>
      </ol>
    </ol>
  </li>

  <li>
    <ol>
      <strong>3. Applications = 300</strong>
	    <ol>
        <li>Windows = 301</li>
        <li>Mac = 302</li>
        <li>UNIX = 303</li>
        <li>Handheld = 304</li>
        <li>IOS (iPad/iPhone) = 305</li>
        <li>Android = 306</li>
        <li>Other = 399</li>
      </ol>
    </ol>
  </li>

  <li>
    <ol>
      <strong>4. Games = 400</strong>
        <ol>
          <li>PC = 401</li>
          <li>Mac = 402</li>
          <li>PSx = 403</li>
          <li>XBOX360 = 404</li>
          <li>Wii = 405</li>
          <li>Handheld = 406</li>
          <li>IOS (iPad/iPhone) = 407</li>
          <li>Android = 408</li>
          <li>Other = 499</li>
        </ol>
    </ol>
  </li>

  <li>
    <ol>
      <strong>5. NSFW = 500</strong>
      <ol>
        <li>Movies = 501</li>
        <li>Movies DVDR = 502</li>
        <li>Pictures = 503</li>
        <li>Games = 504</li>
        <li>HD - Movies = 505</li>
        <li>Movie clips = 506</li>
        <li>Other = 599</li>
      </ol>
    </ol>
  </li>

  <li>
    <ol>
     <strong>6. Other = 600</strong>   
      <ol>
        <li>E-books = 601</li>
        <li>Comics = 602</li>
        <li>Pictures = 603</li>
        <li>Covers = 604</li>
        <li>Physibles = 605</li>
        <li>Other = 699</li>
      </ol>
    </ol>
  </li>

</ul>

#### Response

<div id="response"></div>

```javascript
{
 success: true,
 pagination: {
  nextPage: "Next Page Number",
  prevPage: "Previous Page Number",
  lastPage: "Last Page Number",
  page: "Page Number",
  results: "Results Number"
 }
 query: "Query",
 sort: "Sort Method",
 category: "Torrent Category",
 data: [
   {
     id: "Torrent ID",
     title: "Torrent Title",
     link:
       "Torrent URL Link",
     magnet:
       "Magnet Link",
     info: {
       uploader: "Uploader Username",
       uploadDate: "Date Uploaded",
       size: "Size",
       type: "Type of Torrent",
       category: "Torrent Category",
       seed: "Seeds",
       peers: "Peers",
       vip: "Check if User is vip //Optional",
       trusted: "Check if User is trusted //Optional",
       comments: "Comments Number"
     },
     stream: "Stream Url (if any)"
   }
 ]
}
```

### Get Torrent

<p>The URL</p>

<http://localhost:5000/torrent/:id>

1. :id = Torrent ID

#### Response

```javascript
{
 data: {
   info: {
     type: "Array of Torrent Type",
     files: "Number of Filez",
     size: "Size",
     comments: [
       {
         user: "User name",
         commentInfo: {
           date: "Date Commented",
           time: "Time Commented",
           timeZone: "Time Zone",
           text: "Commented Text"
         }
       }
     ],
     imdbID: "Torrent IMDB ID (if any)",
     lang: "Language (if any)",
     commentsNumber: "Number of Comments",
     tags: "Array of Tags",
     uploaded: {
       date: "Date",
       time: "Time",
       timeZone: "Time Zone"
     },
     detail: {
       author: "Torrent Author",
       seeders: "Seeders Number",
       leechers: "Leechers Number",
       hashInfo: "Hash Info"
     }
   },
   title: "Torrent Title",
   magnet: "Magnet Link",
   descPre: "Torrent Description",
   stream: "Stream Url (if any)"
 }
}
```

#### Browse Torrents

<http://localhost:5000/search/:category?page=1&sort=7>

#### Response

Just Like <a href="#response">Search Response</a>

#### Recent Torrents

<http://localhost:5000/recent?page=1>

#### Response

Just Like <a href="#response">Search Response</a>

#### Top Torrents

<http://localhost:5000/top/:category>

#### Response

Just Like <a href="#response">Search Response</a>
