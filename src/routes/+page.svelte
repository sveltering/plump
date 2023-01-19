<script lang="ts">
	import { P, Plump } from '$lib/index.js';

	console.clear();
	let element = P('div.hi-uoi.io#id-ok_p[data-ok="hel \' o-kk_k"]');
	let span = element.append('span').append('b').text('Hello');
	P('input.hello')
		.appendTo(element)
		.on('input', (event) => {
			span.text(event.target.value);
		});
</script>

<Plump P={element} />
