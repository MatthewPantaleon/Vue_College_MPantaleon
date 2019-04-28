<template>

	<div class="card">
		<div class="card-header">Enrolments</div>

		<div class="card-body">
				
			<div class="row">
				<div class="col">
					<button v-for="p in Math.ceil((enrolments.length / pageSize))" @click="nextPage(p)" class="btn btn-secondary pageButtons ml-2" :id="p">{{ p }}</button>
				</div>
			</div>
				
			<div class="row">
			
				<div class="col-8">
				

				<table class="table table-hover table-striped mt-4">
					<thead class="thead-dark">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Course</th>
							<th scope="col">Student</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody v-if="enrolments.length > 0">
						<tr v-for="i in pageSize" v-if="checkIndex(i)" :key="returnArrayIndex(i).id">
							<th scope="row">{{ returnArrayIndex(i).id }}</th>
							<td>{{ returnArrayIndex(i).course.title }}</td>
							<td>{{ returnArrayIndex(i).student.name }}</td>
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
								<button class="btn btn-info mr-2" @click="switchMode()">View</button>
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
			
        },
		data(){
			return{
				enrolments: [],
				selectedEnrolment: {},
				courses: [],
				students: [],
				statuses: [],
				token: localStorage.getItem("accessToken"),
				pageSize: 15,
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
				
				$(".viewButtons").removeClass("btn-primary").addClass("btn-secondary").html("View");
				$("#" + that.selectedEnrolment.id + "-enrolment").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
				
			},
			deleteEnrolment(id){
				let that = this;
				
				if(!confirm("Delete Enrolment No#: " + id)){
					return;
				}
				
				let realIndex = that.enrolments.findIndex(x => x.id === id);

				that.enrolments.splice(realIndex, 1);
				that.selectedEnrolment = {};
				
				$.ajax({
					method: 'DELETE',
					url: 'api/enrolments/' + id,
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
						console.log(response);
						alert(response.message);
					},
					error: function(response){
						console.log(response);
					}
				});
			},
			switchMode(){
				let that = this;
				
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
					},
					error: function(response){
						console.log(response);
					}
				});
			}
		}
    }
</script>
