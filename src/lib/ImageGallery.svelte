<script>
    import {generateCloudFlareUrl} from "./util.js";
    import {onMount, onDestroy} from "svelte";

    import checkSvg from '../assets/check.svg?raw';

    export let hit;
    export let selectImage = (index) => {};
    let viewing = null;
</script>

<div class="image-gallery">
	{#each hit as image, index (image.id)}
		<div class="image-thumbnail {index === viewing ? 'image-viewing' : ''}" on:click={() => {selectImage(index); viewing = index;}} data-index={index}>
			<img
					src="{generateCloudFlareUrl(image.image, {width: 128, height: 128, fit: 'crop'})}"
					srcset="{generateCloudFlareUrl(image.image, {width: 256, height: 256, fit: 'crop'})} 2x"
					width="128"
					height="128"
			>
			{#if image.selected}
				<div class="checked">
					{@html checkSvg}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
    .image-gallery {
        display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding: 10px;

        &:focus {
            outline: none;
        }
    }

    .image-thumbnail {
        position: relative;
        cursor: pointer;

		// Disable select
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Old versions of Firefox */


        img {
			display: block;
			width: 140px;
			height: 140px;
        }

		&:hover img {
			filter: brightness(1.2);
		}

		&.image-viewing img {
			// Increase brightness and lower contrast
			filter: contrast(0.7) brightness(1.8);
        }

		.checked {
			background: rgba($success-color, 0.8);
            position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;

			justify-content: center;
			align-items: center;

			:global(svg) {
				width: 32px;
				height: 32px;
				stroke: white;
			}
		}
    }
</style>