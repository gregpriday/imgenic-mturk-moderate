<script>
    import {generateCloudFlareUrl} from "./util.js";

    import cancelSvg from '../assets/cancel.svg?raw';
    import starSvg from '../assets/star.svg?raw';
    import rightSvg from '../assets/right.svg?raw';

    export let hit;
    export let selected;
    export let selectImage;
    let gallery;

    // Automatically adjust the scroll when a new image is selected
    $: if (gallery) {
        const thumbnails = gallery.getElementsByClassName('image-thumbnail');
        if (thumbnails && thumbnails[selected]) {
            const scrollPosition = thumbnails[selected].getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft;
            gallery.scroll({
                left: scrollPosition - gallery.clientWidth / 2 + thumbnails[selected].clientWidth / 2,
                behavior: 'smooth'
            });
        }
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
				src="{generateCloudFlareUrl(image.image, {width: 96, height: 96, fit: 'crop'})}"
				srcset="{generateCloudFlareUrl(image.image, {width: 192, height: 192, fit: 'crop'})} 2x"
				width="96"
				height="96"
			>
			{#if image.rating !== null && image.rating !== undefined}
				{#if image.rating === 0}
					<div class="rating-overlay cancel rating-{image.rating}">
						{@html cancelSvg}
					</div>
				{:else}
					<div class="rating-overlay rating rating-{image.rating}">
						<span class="rating-value">{image.rating}</span>
					</div>
				{/if}
			{/if}

			{#if selected === index}
				<div class="arrow">
					{@html rightSvg}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
    .image-gallery {
        display: flex;
        overflow: hidden;
        padding: 20px 10px 0 10px;

        // Disable selected style
        &:focus {
            outline: none;
        }
    }

    .image-thumbnail {
        position: relative;
        cursor: pointer;
		margin-right: 6px;

		&:last-child {
			margin-right: 0;
        }

        img {
			display: block;
			width: 96px;
			height: 96px;
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
			font-weight: 500;
			line-height: 1em;

			svg {
				width: 16px !important;
				height: 16px !important;
			}

            .rating-value {
                margin-right: 10px;
            }

            @for $i from 0 through 5 {
                &.rating-#{$i} {
                    color: mix($primary-color, #FFFFFF, $i * 20%);
                }
            }

            &.cancel {
                :global(svg) {
                    fill: $cancel-color;
                }
            }
        }

        .arrow {
            position: absolute;
            top: -22px;  // Adjust this value to move the arrow up or down
            transform: rotate(90deg);
			left: 50%;
			margin-left: -10px;

            :global(svg) {
                width: 20px;
                height: 20px;
				stroke: #666;
            }
        }
    }
</style>