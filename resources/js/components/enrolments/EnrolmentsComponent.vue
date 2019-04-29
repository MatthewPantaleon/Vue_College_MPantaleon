<template>

	<div class="card mt-5">
		<div class="card-header">
			
			<h5>Enrolments</h5>
			<span v-if="user.name" class="float-right">Welcome, {{ user.name }}</span>
			<button class="btn btn-primary">Home</button>
		
		</div>
		
		<div class="card-body">
				
			<div class="row">
				<div class="col">
					<button v-for="p in Math.ceil((enrolments.length / pageSize))" @click="nextPage(p)" class="btn btn-secondary pageButtons ml-2 mb-1" :id="p">{{ p }}</button>
				</div>
			</div>
				
			<div class="row">
			
				<div class="col-8">
				

				<table class="table table-hover table-striped mt-4">
					<thead class="thead-dark">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Student</th>
							<th scope="col">Course</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody v-if="enrolments.length > 0">
						<tr v-for="i in pageSize" v-if="checkIndex(i)" :key="returnArrayIndex(i).id">
							<th scope="row">{{ returnArrayIndex(i).id }}</th>
							<td>{{ returnArrayIndex(i).student.name }}</td>
							<td>{{ returnArrayIndex(i).course.title }}</td>
							<td><button class="btn btn-secondary viewButtons" :id="returnArrayIndex(i).id+'-enrolment'" @click="viewEnrolment(i)">View</button></router-link></td>
						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td>There are no enrolments</td>
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
									</li>
									<li class="list-group-item">
										<span class="font-weight-bold">Course: </span>{{ selectedEnrolment.course.title }}<br>
										<span class="font-weight-bold">Code: </span>{{ selectedEnrolment.course.code }}<br>
										<span class="font-weight-bold">Level: </span>{{ selectedEnrolment.course.level }}<br>
									
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
									
									<div class="form-group">
										<label for="course_id">Course:</label>
										<select name="course_id" class="form-control">
											<option v-for="c in courses" :value="c.id" :selected="c.id === selectedEnrolment.course.id">{{ c.title }}</option>
										</select>
										<small v-if="Array.isArray(errors.course_id)">{{ errors.course_id[0] }}</small>
									</div>
									
									<hr>
									
									<div class="form-group">
										<label for="date">Date:</label>
										<input type="date" name="date" class="form-control" :value="selectedEnrolment.date">
										<small v-if="Array.isArray(errors.date)">{{ errors.date[0] }}</small>
									</div>
									
									<hr>
									
									<div class="form-group">
										<label for="time">Time:</label>
										<input type="time" name="time" class="form-control" :value="selectedEnrolment.time">
										<small v-if="Array.isArray(errors.time)">{{ errors.time[0] }}</small>
									</div>
									
									<hr>
									
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
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('View Enrolments Mounted');
			that.getEnrolments();
			that.getStudents();
			that.getCourses();
			that.getEnum();
			that.getUser();
        },
		data(){
			return{
				enrolments: [],
				selectedEnrolment: {},
				editEnrolment: {
					student_id: "",
					course_id: "",
					date: "",
					time: "",
					status: "",
				},
				user:{
					name: "",
					email: ""
				},
				courses: [],
				students: [],
				statuses: [],
				errors: {},
				token: localStorage.getItem("accessToken"),
				pageSize: 10,
				pageNumber: 1,
				viewMode: true,
			}
		},
		methods:{
			getEnrolments(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/enrolments',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
						console.log(response);
						that.enrolments = response;
						that.selectedEnrolment = response[0];
						
						$(document).ready(function(){
    						$("#" + that.pageNumber).addClass("btn-primary").removeClass("btn-secondary");
							$("#" + that.selectedEnrolment.id + "-enrolment").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
						});
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			nextPage(p){
				let that = this;
				that.pageNumber = p;
				$(".pageButtons").removeClass("btn-primary").addClass("btn-secondary");
				$("#" + that.pageNumber).addClass("btn-primary").removeClass("btn-secondary");
				$(document).ready(function(){
					$("#" + that.selectedEnrolment.id + "-enrolment").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
				});
			},
			checkIndex(index){
				let that = this;
				
				if(that.enrolments[(index - 1) + (that.pageSize * (that.pageNumber - 1))] != undefined){
					return true;
				}else{
					return false;
				}
			},
			returnArrayIndex(index){
				let that = this;
				return that.enrolments[(index - 1) + (that.pageSize * (that.pageNumber - 1))];
			},
			viewEnrolment(index){
				let that = this;
				that.selectedEnrolment = that.returnArrayIndex(index);
				
				//change the state of the view buttons to reflect which enrolment is selected
				$(".viewButtons").removeClass("btn-primary").addClass("btn-secondary").html("View");
				$("#" + that.selectedEnrolment.id + "-enrolment").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
				that.viewMode = true;
				that.errors = {};
			},
			deleteEnrolment(id){
				let that = this;
				
				if(!confirm("Delete Enrolment No#: " + id)){
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
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			switchMode(){
				let that = this;
				that.errors = {};
				
				if(that.viewMode){
					that.viewMode = false;
				}else{
					that.viewMode = true;
				}
			},
			getStudents(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/students',
					headers:{
						Authorization: "Bearer " + that.token
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
			getCourses(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/courses',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
						console.log(response);
						that.courses = response;
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			getEnum(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/statuses',
					headers:{
						Authorization: "Bearer " + that.token
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
						console.log(response);
						that.selectedEnrolment = response;
						let realIndex = that.enrolments.findIndex(x => x.id === id);
						that.enrolments.splice(realIndex, 1, response);
						that.errors = {};
					},
					error: function(response){
						console.log(response);
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
					},
					error: function(response){
						console.log(response);
					}
				});
			}
		}
    }
</script>
