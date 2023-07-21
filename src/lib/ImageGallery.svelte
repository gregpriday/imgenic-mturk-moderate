<script>
    import {generateCloudFlareUrl} from "./util.js";

    import cancelSvg from '../assets/cancel.svg?raw';
    import starSvg from '../assets/star.svg?raw';

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
		<div class="image-thumbnail {(image.rating !== null && image.rating !== undefined) ? 'rated' : ''}" on:click={() => selectImage(index)}>
			<img
				src="{generateCloudFlareUrl(image.image, {width: 128, height: 128, fit: 'crop'})}"
				width="128"
				height="128"
			>
			{#if image.rating !== null && image.rating !== undefined}
				{#if image.rating === 0}
					<div class="rating-overlay cancel">
						{@html cancelSvg}
					</div>
				{:else}
					<div class="rating-overlay rating">
						<span class="rating-value">{image.rating}</span>
						{@html starSvg}
					</div>
				{/if}
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
    .image-gallery {
        display: flex;
        overflow-x: scroll;
        padding: 10px 0;

        // Disable selected style
        &:focus {
            outline: none;
        }
    }

    .image-thumbnail {
        position: relative;
        cursor: pointer;

        img {
			display: block;
        }

        .rating-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 1.5em;
			line-height: 1em;

			svg {
				width: 24px;
				height: 24px;
			}

            .rating-value {
                margin-right: 10px;
            }

			&.cancel {
				color: #B22222;

				svg {
                    fill: #B22222;
				}
			}

			&.rating {
                color: #FFD700;

                svg {
                    fill: #FFD700;
                }
			}
        }
    }
</style>