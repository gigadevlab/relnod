services:

	type-info service: (hangi infolar alinabilir)
		single-node:
			post:
				type
				key
				ticket


			person:
				abonelikler
				araba tescil
				telefon iltisaklari
				kaldigi oteller

			etc.

		multi-node actions:

	
	info service: (info alma)
		get: 
			type
			key 
			ticket

	relation service:
		post:
			body:
				ticket
				nodes {type, key}: []
			response:
				node1
				node2
				relation



	ticket service:
		get:
			ticket

	node-types service:
		get: 
			name
			desc
			icon

	node:
		key (or id)
		

toolbox: (sagda)
	node-types: (entities)
		person
		car
		phone 
		adsl
		hotel
		plane
		building


arayuz: 
	secme (kutu icine alma, ctrl ile secme, secimi kaldirma)
	silme (end-to-end)
	kaydetme (csv, json)
	ekleme (csv, json)
	merge

