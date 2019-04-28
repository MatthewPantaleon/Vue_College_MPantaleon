<template>

	<div class="card">
		<div class="card-header">I am the welcome</div>

		<div class="card-body">
			<form @submit.prevent="test()">
				<input type="text" name="date">
				<input type="text" name="time">
				<select name="status">
					<option>Select Status</option>
					<option v-for="s in statuses" value="s">{{ s }}</option>
				</select>
				
				<select name="course_id">
					<option value="">Select Course</option>
					<option v-for="c in courses" value="c.id">{{ c.title }}</option>
				</select>
				
				<select name="student_id">
					<option value="">Select Student</option>
					<option v-for="s in students" value="s.id">{{ s.name }}</option>
				</select>
				
				<button>SUBMIT</button>
			</form>
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('CreateEnrolment Mounted');
			
			//get corses and students
			that.getCourses();
			that.getStudents();
			that.getStatuses();
        },
		data(){
			return{
				courses: [],
				students: [],
				statuses: [],
				token: localStorage.getItem('accessToken'),
				name: "",
				time: "",
				status: "",
				courese_id: "",
				student_id: ""
			}
		},
		methods:{
			test(){
				console.log("TETS");
			},
			getCourses(){
				let that = this;
				$.ajax({
					method: 'GET',
					url: 'api/courses',
					success: function(response){
						console.log(response);
						that.courses = response;
					},
					error: function(reponse){
						console.log(response);
					}
				});
			},
			getStudents(){
				let that = this;
				$.ajax({
					method: 'GET',
					url: "api/students",
					headers:{
						Authorization: "Bearer " + localStorage.getItem("accessToken")
					},
					success: function(response){
						console.log(response);
						that.students = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			getStatuses(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: "api/statuses",
					headers:{
						Authorization: "Bearer " + localStorage.getItem("accessToken")
					},
					success: function(response){
						console.log(response);
						that.statuses = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			submitEnrolement(){
				
			}
		}
    }
</script>
