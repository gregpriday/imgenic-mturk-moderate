<script>
    export let hit = {};

    // Count the number of images for each rating
    let ratingCounts = Array(6).fill(0);
    let maxCount = 0;
    $: {
        ratingCounts = Array(6).fill(0);
        hit.forEach(image => {
            if (image.rating !== null && image.rating !== undefined) {
                ratingCounts[image.rating]++;
            }
        });
        maxCount = Math.max(...ratingCounts);
        maxCount = Math.max(maxCount, 3);
    }
</script>

<div class="rating-histogram">
	{#each ratingCounts as count, index (index)}
		<div class={`bar rating-${index}`} style="height: {maxCount > 0 ? (count / maxCount) * 100 : 0}%;"></div>
	{/each}
</div>

<style lang="scss">
    .rating-histogram {
        display: flex;
        align-items: flex-end;
        height: 20px;  // Make the height a percent
        width: 64px;
		background: rgba(white, 0.9);
		padding: 4px 4px 0 4px;
    }

    .bar {
        flex: 1;
        margin-right: 1px;

        &:last-child {
            margin-right: 0;
        }
    }

    @for $i from 0 through 5 {
        .rating-#{$i} {
            background: mix($primary-color, $cancel-color, $i * 20%);
        }
    }
</style>