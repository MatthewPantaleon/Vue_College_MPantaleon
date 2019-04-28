<template>

	<div class="card">
		<div class="card-header">I am the enrolment</div>

		<div class="card-body">
			This is a single Enrolment
			{{ en }}
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('Enrolment View Mounted');
			
        },
		props:{
			id:{
				type: Number
			}
		},
		data(){
			return{
				enrolment: {},
				enId: 0
			}
		},
		methods:{
			getEnrolment(){
				let that = this;
				
				
			}
		}
    }
</script>
