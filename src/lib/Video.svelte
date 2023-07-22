<script>
    export let video = "";
</script>

<div style="position: relative; padding-top: 56.25%;">
	<iframe
			src={`https://customer-isl9oh0nod784ar4.cloudflarestream.com/${video}/iframe?preload=true`}
			style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
			allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
			allowfullscreen="true"
	></iframe>
</div>
