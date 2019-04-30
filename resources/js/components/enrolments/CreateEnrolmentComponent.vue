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
							<select name="student" class="form-control" v-model="student_id" @change="selectStudent(student_id)">
								<option value="">Select Student</option>
								<option v-for="s in students" :value="s.id">{{ s.name }}</option>
							</select>
							<small v-if="Array.isArray(errors.student_id)">{{ errors.student_id[0] }}</small>
						</div>
						
						<ul class="list-group list-group-flush mb-4">
								<li class="list-group-item">
									
									<span class="font-weight-bold">Course Enrolments: </span>
									
									<div v-for="sen in selectedStudentEnrolments">
										<span :id="sen.course.id + '-course'">{{ sen.course.title }}</span><br>
									</div>
									<h6 style="color: red;" class="mt-4" id="warning"></h6>
									<div v-if="selectedStudentEnrolments.length == 0">
										This student is not enroled in any courses.
									</div>
								</li>
						</ul>

						<div class="form-group">
							<label for="course">Course:</label>
							<select name="course" class="form-control" v-model="course_id" @change="checkCourse(course_id)">
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
				selectedStudentEnrolments: [],
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
			//get courses, students and statuses
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
//						console.log(response);
						that.statuses = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			
			//get currently selected student
			selectStudent(index){
				let that = this;
				let realIndex = that.students.findIndex(x => x.id === index);
				that.selectedStudent = that.students[realIndex];
				
				$(document).ready(function(){
					$("span").css("color", "#636b6f");
					$("#warning").html();
				});
				
				that.selectedStudentEnrolments = that.selectedStudent.enrolments;
				that.checkCourse(that.course_id);
			},
			
			//submit new enrolment
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
//						console.log(response.responseJSON);
						that.errors = response.responseJSON;
					}
				});
				
			},
			
			//checks if the selected course for the student alraedy exists and marks them red
			checkCourse(courseId){
				let that = this;
				
				for(let i = 0; i < that.selectedStudentEnrolments.length; i++){
					let en = that.selectedStudentEnrolments[i];
					
					$("span").css("color", "#636b6f");
					
					if(courseId == en.course.id){
						$(document).ready(function(){
							$("#" + en.course.id + "-course").css("color", "red");
							$("#warning").html("Student is already enroled in this course.");
						});
						break;
					}else{
						$(document).ready(function(){
							$("#" + en.course.id + "-course").css("color", "#636b6f");
							$("#warning").html("");
						});
					}
				}
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
