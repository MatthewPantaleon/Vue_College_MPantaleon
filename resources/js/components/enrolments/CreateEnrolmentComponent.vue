<template>
	
	<div class="row justify-content-center">
		<div class="col-6">
			<div class="card mt-5">
				<div class="card-header">
					<h5 style="display: inline-block">Create Enrolment</h5>
					<router-link to="/enrolments"><button class="btn btn-primary float-right">Back to Enrolments</button></router-link>
				</div>

				<div class="card-body">
					<form @submit.prevent="submitEnrolment()">
						<div class="form-group">
							<label for="student">Student:</label>
							<select name="student" class="form-control" v-model="student_id">
								<option value="">Select Student</option>
								<option v-for="s in students" :value="s.id">{{ s.name }}</option>
							</select>
							<small v-if="Array.isArray(errors.student_id)">{{ errors.student_id[0] }}</small>
						</div>
						
						<hr>

						<div class="form-group">
							<label for="course">Course:</label>
							<select name="course" class="form-control" v-model="course_id">
								<option value="">Select Course</option>
								<option v-for="c in courses" :value="c.id">{{ c.title }}</option>
							</select>
							<small v-if="Array.isArray(errors.course_id)">{{ errors.course_id[0] }}</small>
						</div>
						
						<hr>
						
						<div class="form-group">
							<label for="date">Date of Enrolment:</label>
							<input type="date" name="date" class="form-control" v-model="date">
							<small v-if="Array.isArray(errors.date)">{{ errors.date[0] }}</small>
						</div>
						
						<hr>
						
						<div class="form-group">
							<label for="time">Time of Enrolment:</label>
							<input type="time" name="time" class="form-control" v-model="time">
							<small v-if="Array.isArray(errors.time)">{{ errors.time[0] }}</small>
						</div>
						
						<hr>
						
						<div class="form-group">
							<label for="status">Status:</label>
							<select name="status" class="form-control" v-model="status">
								<option value="">Select Status</option>
								<option v-for="s in statuses" :value="s">{{ s }}</option>
							</select>
							<small v-if="Array.isArray(errors.status)">{{ errors.status[0] }}</small>
						</div>
						<hr>

						<button class="btn btn-primary">Submit</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('CreateEnrolment Mounted');
			that.getUser();
        },
		data(){
			return{
				courses: [],
				students: [],
				statuses: [],
				selectedStudent: {},
				token: localStorage.getItem('accessToken'),
				name: "",
				time: "",
				date: "",
				status: "",
				course_id: "",
				student_id: "",
				errors: {},
				user: {}
			}
		},
		methods:{
			getCourses(){
				let that = this;
				$.ajax({
					method: 'GET',
					url: 'api/courses',
					success: function(response){
//						console.log(response);
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
//						console.log(response);
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
//						console.log(response);
						that.statuses = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			submitEnrolment(){
				let that = this;
				let formData = {time: that.time, date: that.date, status: that.status, course_id: that.course_id, student_id: that.student_id};
				
				$.ajax({
					method: 'POST',
					url: 'api/enrolments',
					headers:{
						Authorization: "Bearer " + localStorage.getItem("accessToken")
					},
					dataType: 'json',
					data: formData,
					success: function(response){
						alert("Enrolment Created Succesfully");
						that.$router.push("/enrolments");
					},
					error: function(response){
						console.log(response.responseJSON);
						that.errors = response.responseJSON;
					}
				});
				
			},
			getUser(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/user',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
//						console.log(response);
						that.user.name = response.user.name;
						that.user.email = response.user.email;
						
						//get corses and students
						that.getCourses();
						that.getStudents();
						that.getStatuses();
						
					},
					error: function(response){
						alert("You are not logged in.");
						that.$router.push("/");
					}
				});
			}
		}
    }
</script>
