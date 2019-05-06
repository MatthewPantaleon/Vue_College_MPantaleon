<template>

	<div class="card mt-5">
		
		<div class="card-header">
			<h5 style="display: inline-block;">Enrolments</h5>
			<span v-if="user.name" class="float-right">Welcome, {{ user.name }}</span><!-- Display name -->
		</div>
		
		<div class="card-body">
			
			<!-- Row for page numbers -->
			<div class="row">
				<div class="col-8">
					<button v-for="p in Math.ceil((enrolments.length / pageSize))" @click="nextPage(p)" class="btn btn-secondary pageButtons ml-2 mb-1" :id="p">{{ p }}</button>
				</div>
				
				<!-- Navigation buttons -->
				<div class="col-4">
					<router-link to="/"><button class="btn btn-primary float-right ml-1">Home</button></router-link>
					<router-link to="/courses"><button class="btn btn-primary float-right ml-1">Courses</button></router-link>
					<router-link to="/students"><button class="btn btn-primary float-right ml-1">Students</button></router-link>
					<router-link to="/createEnrolment"><button class="btn btn-success float-right ml-1 mt-1">Create Enrolment</button></router-link>
				</div>
			</div>
			
			<!-- main row: table and enrolment card-->
			<div class="row">
				
				<!-- Enrolment Table -->
				<div class="col-8">
					<table class="table table-hover table-striped mt-4">
						<thead class="thead-dark">
							<tr>
								<th scope="col">#</th>
								<th scope="col">Student</th>
								<th scope="col">Course</th>
								<th scope="col">Status</th>
								<th scope="col"></th>
							</tr>
							
							<!-- Filter row -->
							<tr>
								<th scope="col">Filters:</th>
								<th>
									<select name="studentFilter" class="form-control" id="searchStudent" v-model="searchStudent" @change="filter(searchStudent, searchCourse, searchStatus)">
										<option value="">Search Student</option>
										<option v-for="s in students" :value="s.id">{{ s.name }}</option>
									</select>
								</th>
								<th>
									<select name="courseFilter" class="form-control" id="searchCourse" v-model="searchCourse" @change="filter(searchStudent, searchCourse, searchStatus)">
										<option value="">Search Course</option>
										<option v-for="c in courses" :value="c.id">{{ c.title }}</option>
									</select>
								</th>
								<th colspan="2">
									<select name="statusFilter" class="form-control" v-model="searchStatus" @change="filter(searchStudent, searchCourse, searchStatus)">
										<option value="">Search Status</option>
										<option v-for="s in statuses" :value="s">{{ s }}</option>
									</select>
								</th>
							</tr>
						</thead>
						<tbody v-if="enrolments.length > 0">
							<tr v-for="i in pageSize" v-if="checkIndex(i)" :key="returnArrayIndex(i).id">
								<th scope="row">{{ returnArrayIndex(i).id }}</th>
								<td>{{ returnArrayIndex(i).student.name }}</td>
								<td>{{ returnArrayIndex(i).course.title }}</td>
								<td>{{ returnArrayIndex(i).status }}</td>
								<td><button class="btn btn-secondary viewButtons" :id="returnArrayIndex(i).id+'-enrolment'" @click="viewEnrolment(i)">View</button></td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="2">There are no enrolments</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<!-- View Current Enrolment -->
				<div class="col-4">
					<span v-if="Object.keys(selectedEnrolment).length != 0">
						<div class="card mt-4">
							<div class="card-header">
								<h5 class="card-title">Showing Enrolment No#: {{ selectedEnrolment.id }}</h5>
							</div>
							
							<!-- Card body for viewing current enrolment -->
							<div class="card-body" v-if="viewMode">
								<ul class="list-group list-group-flush">
									<li class="list-group-item">
										<span class="font-weight-bold">Name: </span>{{ selectedEnrolment.student.name }}<br>
										<span class="font-weight-bold">Phone: </span>{{ selectedEnrolment.student.phone }}<br>
										<span class="font-weight-bold">Address: </span>{{ selectedEnrolment.student.address }}<br>
										<span class="font-weight-bold">Email: </span>{{ selectedEnrolment.student.email }}<br>
									</li>
									<li class="list-group-item">
										<span class="font-weight-bold">Course: </span>{{ selectedEnrolment.course.title }}<br>
										<span class="font-weight-bold">Code: </span>{{ selectedEnrolment.course.code }}<br>
										<span class="font-weight-bold">Level: </span>{{ selectedEnrolment.course.level }}<br>
										<span class="font-weight-bold">Points: </span>{{ selectedEnrolment.course.points }}<br>
									</li>
									<li class="list-group-item"><span class="font-weight-bold">Date of Enrolment: </span>{{selectedEnrolment.date}}</li>
									<li class="list-group-item"><span class="font-weight-bold">Time of Enrolment: </span>{{selectedEnrolment.time}}</li>
									<li class="list-group-item"><span class="font-weight-bold">Status: </span>{{selectedEnrolment.status}}</li>
									<li class="list-group-item">
										<button class="btn btn-info mr-2" @click="switchMode()">Edit</button>
										<button class="btn btn-danger" @click="deleteEnrolment(selectedEnrolment.id)">Delete</button>
									</li>
								</ul>
							</div>
							
							<!-- EDit Mode -->
							<div class="card-body" v-else>
								<form @submit.prevent="submitEdit(selectedEnrolment.id)" id="editForm">
									
									<!-- Student -->
									<div class="form-group">
										<label for="student_id">Student:</label>
										<select name="student_id" class="form-control">
											<option v-for="s in students" :value="s.id" :selected="s.id === selectedEnrolment.student.id">{{ s.name }}</option>
										</select>
										<small v-if="Array.isArray(errors.student_id)">{{ errors.student_id[0] }}</small>
									</div>
									
									<hr>
									<!-- Course -->
									<div class="form-group">
										<label for="course_id">Course:</label>
										<select name="course_id" class="form-control">
											<option v-for="c in courses" :value="c.id" :selected="c.id === selectedEnrolment.course.id">{{ c.title }}</option>
										</select>
										<small v-if="Array.isArray(errors.course_id)">{{ errors.course_id[0] }}</small>
									</div>
									
									<hr>
									
									<!-- Date -->
									<div class="form-group">
										<label for="date">Date:</label>
										<input type="date" name="date" class="form-control" :value="selectedEnrolment.date">
										<small v-if="Array.isArray(errors.date)">{{ errors.date[0] }}</small>
									</div>
									
									<hr>
									
									<!-- Time -->
									<div class="form-group">
										<label for="time">Time:</label>
										<input type="time" name="time" class="form-control" :value="selectedEnrolment.time">
										<small v-if="Array.isArray(errors.time)">{{ errors.time[0] }}</small>
									</div>
									
									<hr>
									
									<!-- Status -->
									<div class="form-group">
										<label for="status">Status:</label>
										<select name="status" class="form-control">
											<option v-for="s in statuses" :value="s" :selected="s === selectedEnrolment.status" >{{ s }}</option>
										</select>
										<small v-if="Array.isArray(errors.status)">{{ errors.status[0] }}</small>
									</div>
									

									<button class="btn btn-primary">Submit</button>
									<hr>
								</form>
								
								<button class="btn btn-info mr-2 mt-3" @click="switchMode()">View</button>
							</div>
						</div>
					
					</span>
					<span v-else>
						<div class="card mt-4">
							<div class="card-header">
								<h5 class="card-title">No Enrolment Selected</h5>
							</div>
						</div>
					</span>
				</div>
			</div>
			<!-- END main row -->
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('View Enrolments Mounted');
			
			//validate user first
			that.getUser();
        },
		data(){
			return{
				//arrays to hold data
				enrolments: [],
				trueEnrolments: [],
				courses: [],
				students: [],
				statuses: [],
				
				//current enrolment object
				selectedEnrolment: {},
				
				//object to hold edit data for current enrolment object
				editEnrolment: {
					student_id: "",
					course_id: "",
					date: "",
					time: "",
					status: "",
				},
				
				//object to hold verified user credentials
				user:{
					name: "",
					email: ""
				},
				
				errors: {},
				token: localStorage.getItem("accessToken"),
				pageSize: 10,
				pageNumber: 1,
				viewMode: true,
				
				//variables used to store filter parameters
				searchStudent: "",
				searchCourse: "",
				searchStatus: ""
			}
		},
		methods:{
			
			//gets enrolments
			getEnrolments(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/enrolments',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
//						console.log(response);
						that.enrolments = response;
						that.trueEnrolments = that.enrolments;
						that.selectedEnrolment = response[0];
						
						that.updateJQuery();
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			
			//gets students
			getStudents(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/students',
					headers:{
						Authorization: "Bearer " + that.token
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
			
			//gets courses
			getCourses(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/courses',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
//						console.log(response);
						that.courses = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			
			//gets the enum values from the status column
			getEnum(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/statuses',
					headers:{
						Authorization: "Bearer " + that.token
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
			
			//changes the page number and updates the DOM accordingly
			nextPage(p){
				let that = this;
				that.pageNumber = p;
				that.updateJQuery();
			},
			
			//returns a boolean to check if the index exists
			checkIndex(index){
				let that = this;
				return that.enrolments[(index - 1) + (that.pageSize * (that.pageNumber - 1))] != undefined ? true : false;
			},
			
			//returns the object in this index in the enrolment array
			returnArrayIndex(index){
				let that = this;
				return that.enrolments[(index - 1) + (that.pageSize * (that.pageNumber - 1))];
			},
			
			//holds the current enrolment object selected
			viewEnrolment(index){
				let that = this;
				that.selectedEnrolment = that.returnArrayIndex(index);
				
				that.updateJQuery();
				that.viewMode = true;
				that.errors = {};
			},
			
			//delete enrolment
			deleteEnrolment(id){
				let that = this;
				
				if(!confirm("Delete Enrolment No#: " + id + "?")){
					return;
				}
				
				let realIndex = that.enrolments.findIndex(x => x.id === id);

				$.ajax({
					method: 'DELETE',
					url: 'api/enrolments/' + id,
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
						console.log(response);
						that.enrolments.splice(realIndex, 1);
						that.selectedEnrolment = {};
						alert(response.message);
						
						if(that.enrolments.length % that.pageSize == 0){
							that.pageNumber -= 1;
							that.updateJQuery();
						}
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			
			//switches between viewing and editing an enrolment
			switchMode(){
				let that = this;
				that.errors = {};
				that.viewMode ? that.viewMode = false : that.viewMode = true;

			},
			
			//submit request to update selected enrolment
			submitEdit(id){
				let that = this;
				
//				console.log($("#editForm").serializeArray());
				$.ajax({
					method: 'PUT',
					url: 'api/enrolments/' + id,
					headers:{
						Authorization: "Bearer " + that.token
					},
					dataType: 'json',
					data: $("#editForm").serializeArray(),
					success: function(response){
//						console.log(response);
						that.selectedEnrolment = response;
						let realIndex = that.trueEnrolments.findIndex(x => x.id === id);
						that.trueEnrolments.splice(realIndex, 1, response);
						that.errors = {};
						that.viewMode = true;
						that.filter(that.searchStudent, that.searchCourse, that.searchStatus);
					},
					error: function(response){
//						console.log(response);
						that.errors = response.responseJSON;
					}
				});
			},
			
			//validates if a valid user is logged in
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
						
						//once the user is verified then get all the data
						that.getEnrolments();
						that.getStudents();
						that.getCourses();
						that.getEnum();
					},
					error: function(response){
						alert("You are not logged in.");
						that.$router.push("/");
					}
				});
			},
			
			//filter out enrolments based on student, course and status
			filter(studentId, courseId, status){
				let that = this;
				
				//resets enrolments array to hold all enrolments
				studentId == "" && courseId == "" && status == "" ? that.enrolments = that.trueEnrolments : 0;
				that.updateJQuery();
				
				//re-enables selects if both are empty
				if(studentId == "" && courseId == ""){
					$("#searchCourse").prop('disabled', false);
					$("#searchStudent").prop('disabled', false);
				}
				
				//returns enrolments with this student only
				if(Number.isInteger(studentId) && courseId == "" && status == ""){
					that.enrolments = that.trueEnrolments;
					let temp = [];
					$("#searchCourse").prop('disabled', true);
					
					
					that.enrolments.forEach(function(obj, i){
						if(obj.student_id == studentId){
							temp.push(obj);
						}
					});
					that.pageNumber = 1;
					that.updateJQuery();
					that.enrolments = temp;
				}
				
				//returns enrolments with this course only
				if(studentId == "" && Number.isInteger(courseId) && status == ""){
					that.enrolments = that.trueEnrolments;
					
					let temp = [];
					$("#searchStudent").prop('disabled', true);
					
					that.enrolments.forEach(function(obj, i){
						if(obj.course_id == courseId){
							temp.push(obj);
						}
					});
					that.pageNumber = 1;
					that.updateJQuery();
					that.enrolments = temp;
				}
				
				//returns enrolments with this status only
				if(studentId == "" && courseId == "" && status != ""){
					that.enrolments = that.trueEnrolments;
					
					let temp = [];
					
					that.enrolments.forEach(function(obj, i){
						if(obj.status == status){
							temp.push(obj);
						}
					});
					that.pageNumber = 1;
					that.updateJQuery();
					that.enrolments = temp;
				}
				
				//returns enrolments with course with a specific status
				if(studentId == "" && Number.isInteger(courseId) && status != ""){
					that.enrolments = that.trueEnrolments;
					
					let temp = [];
					$("#searchStudent").prop('disabled', true);
					
					that.enrolments.forEach(function(obj, i){
						if(obj.status == status && obj.course_id == courseId){
							temp.push(obj);
						}
					});
					that.pageNumber = 1;
					
					that.updateJQuery();
					that.enrolments = temp;
				}
				
				//returns enrolments with student with a specific status for all their courses
				if(Number.isInteger(studentId) && courseId == "" && status != ""){
					that.enrolments = that.trueEnrolments;
					
					let temp = [];
					$("#searchCourse").prop('disabled', true);
					
					that.enrolments.forEach(function(obj, i){
						if(obj.status == status && obj.student_id == studentId){
							temp.push(obj);
						}
					});
					that.pageNumber = 1;
					
					that.updateJQuery();
					that.enrolments = temp;
				}
			},
			
			//fucntion to update all DOM elements that give user feedback
			updateJQuery(){
				let that = this;
				$(document).ready(function(){
					$(".viewButtons").addClass("btn-secondary").removeClass("btn-primary").html("View");
					$("#" + that.selectedEnrolment.id + "-enrolment").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
					
					$(".pageButtons").addClass("btn-secondary").removeClass("btn-primary");
					$("#" + that.pageNumber).addClass("btn-primary").removeClass("btn-secondary");
				});
			}
		}
    }
</script>
