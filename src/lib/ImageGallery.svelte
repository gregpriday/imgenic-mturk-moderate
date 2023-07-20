<script>
    import {generateCloudFlareUrl} from "./util.js";

    export let hit;
    export let selected;
    export let selectImage;
    let gallery;

    // Automatically adjust the scroll when a new image is selected
    $: if (gallery) {
        const scrollPosition = selected * 138 - gallery.clientWidth / 2 + 64;
        gallery.scroll({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
        }
    };
</script>

<div class="image-gallery" bind:this={gallery} on:keydown={handleKeyDown} tabindex="0">
	{#each hit as image, index (image.id)}
		<div class="image-thumbnail">
			<img
				src="{generateCloudFlareUrl(image.image, {width: 128, height: 128, fit: 'crop'})}"
				width="128"
				height="128"
				on:click={() => selectImage(index)}
			>
		</div>
	{/each}
</div>

<style lang="scss">
    .image-gallery {
        display: flex;
        overflow-x: scroll;
        padding: 10px;

		// Disable selected style
		&:focus {
			outline: none;
        }
    }

    .image-thumbnail {
        padding: 0 5px;

		img {
			cursor: pointer;
		}
    }
</style>
