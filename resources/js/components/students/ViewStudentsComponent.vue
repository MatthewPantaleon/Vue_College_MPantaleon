<template>

	<div class="card mt-5">
		<div class="card-header">
			<h5 style="display: inline-block">Students</h5>
			
			<!-- Nvigation -->
			<router-link to="/"><button class="btn btn-primary float-right ml-1">Home</button></router-link>
			<router-link to="/enrolments"><button class="btn btn-primary float-right ml-1">Enrolments</button></router-link>
			<router-link to="/courses"><button class="btn btn-primary float-right">Courses</button></router-link>
			
			<!-- Display name -->
			<div class="row" v-if="user.name">
				<div class="col">
					Welcome, {{ user.name }}
				</div>
			</div>
		</div>

		<div class="card-body">
			
			<!-- Page numbers -->
			<div class="row">
				<div class="col">
					<button v-for="p in Math.ceil((students.length / pageSize))" @click="nextPage(p)" class="btn btn-secondary pageButtons ml-2 mb-1" :id="p">{{ p }}</button>
				</div>
			</div>
			
			
			<div class="row">
				<!-- Students table  -->
				<div class="col-8">
					<table class="table table-hover table-striped">
						<thead class="thead-dark">
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Email</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							<tr v-for="i in pageSize" v-if="checkIndex(i)" :key="returnArrayIndex(i).id">
								<td>{{ returnArrayIndex(i).id }}</td>
								<td>{{ returnArrayIndex(i).name }}</td>
								<td>{{ returnArrayIndex(i).email }}</td>
								<td><button class="btn btn-secondary viewButtons" :id="returnArrayIndex(i).id + '-student'" @click="viewStudent(returnArrayIndex(i).id)" >View</button></td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<!-- View selected student -->
				<div class="col-4">
					<div class="card" v-if="Object.keys(selectedStudent).length != 0">
						<div class="card-header">
							<h5>Student No#: {{ selectedStudent.id }}</h5>
						</div>
						<div class="card-body">
							<ul class="list-group list-group-flush" >
								
								<li class="list-group-item">
									<span class="font-weight-bold">Name: </span>{{ selectedStudent.name }}<br>
									<span class="font-weight-bold">Email: </span>{{ selectedStudent.email }}<br>
									<span class="font-weight-bold">Phone: </span>{{ selectedStudent.phone }}<br>
									<span class="font-weight-bold">Address: </span>{{ selectedStudent.address }}<br>
								</li>
								
								<li class="list-group-item">
									
									<span class="font-weight-bold">Course Enrolments: </span>
									
									<div v-for="sen in selectedStudentEnrolments">
										{{ sen.course.title }}<br>
									</div>
									<div v-if="selectedStudentEnrolments.length == 0">
										No Enrolments for this student.
									</div>
								</li>
								
							</ul>
						</div>
					</div>
					<div class="card" v-else>
						<div class="card-header">
							<h5>No Student Selected</h5>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>

	
</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('Students Mounted');
			
			//validate user first
			that.getUser();
        },
		data(){
			return{
				students: [],
				selectedStudent:{},
				selectedStudentEnrolments:[],
				user:{
					name: localStorage.getItem("name"),
					token: localStorage.getItem("accessToken"),
					email: localStorage.getItem("email")
				},
				pageSize: 8,
				pageNumber: 1
			}
		},
		methods:{
			//get students
			getStudents(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/students',
					headers:{
						Authorization: "Bearer " + localStorage.getItem("accessToken")
					},
					success: function(response){
//						console.log(response);
						that.students = response;
						that.selectedStudent = response[0];
						that.selectedStudentEnrolments = response[0].enrolments;
						
						$(document).ready(function(){
    						$("#" + that.pageNumber).addClass("btn-primary").removeClass("btn-secondary");
							$("#" + that.selectedStudent.id + "-student").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
						});
						
					},
					error: function(response){
						
					}
				});
			},
			
			//assign selected student
			viewStudent(id){
				let that = this;
				
				let realIndex = that.students.findIndex(x => x.id === id);
				that.selectedStudent = that.students[realIndex];
				that.selectedStudentEnrolments = that.selectedStudent.enrolments;
				
				that.updateJQuery();
			},
			
			//authenticate user
			getUser(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/user',
					headers:{
						Authorization: "Bearer " + that.user.token
					},
					success: function(response){
//						console.log(response);
						that.user.name = response.user.name;
						that.user.email = response.user.email;

						that.getStudents();
					},
					error: function(response){
						alert("You are not logged in.");
						that.$router.push("/");
					}
				});
			},
			
			//returns boolean if the inedx exists
			checkIndex(index){
				let that = this;
				return that.students[(index - 1) + (that.pageSize * (that.pageNumber - 1))] != undefined ? true : false;
			},
			
			//returns student object for index
			returnArrayIndex(index){
				let that = this;
				return that.students[(index - 1) + (that.pageSize * (that.pageNumber - 1))];
			},
			
			//pagination for students
			nextPage(p){
				let that = this;
				that.pageNumber = p;
				
				that.updateJQuery();
			},
			
			//update DOM elements for user feedback
			updateJQuery(){
				let that = this;
				$(document).ready(function(){
					$(".viewButtons").addClass("btn-secondary").removeClass("btn-primary").html("View");
					$("#" + that.selectedStudent.id + "-student").removeClass("btn-secondary").addClass("btn-primary").html("Selected");
					
					$(".pageButtons").addClass("btn-secondary").removeClass("btn-primary");
					$("#" + that.pageNumber).addClass("btn-primary").removeClass("btn-secondary");
				});
			}
		}
    }
</script>
