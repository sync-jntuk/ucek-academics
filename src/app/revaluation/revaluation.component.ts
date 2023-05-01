import { Component } from '@angular/core';
import { BackendService } from '../services/backend/backend.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-revaluation',
	templateUrl: './revaluation.component.html',
	styleUrls: ['./revaluation.component.css']
})
export class RevaluationComponent {

	constructor(private bk: BackendService) { }

	roll = ''
	year = ''
	semester = ''
	subjects: any = []
	DU_number = ''
	regulation = ''
	user_data: any = {}

	class_name: String = ''
	changeClass() {
		if (this.class_name == '') {
			this.class_name = 'toggle-sidebar'
		} else {
			this.class_name = ''
		}
	}

	loading: boolean = false
	ngOnInit(): void {
		this.roll = localStorage.getItem('roll') || ''
		this.regulation = localStorage.getItem('regulation') || ''
		this.user_data = JSON.parse(localStorage.getItem('user_data') || '')
	}

	checkParams() {
		if (this.regulation != '' && this.year != '' && this.semester != '') {
			this.getSubjects({ regulation_: this.regulation, year: this.year, semester: this.semester });
		}
	}

	getSubjects(params: any): void {
		this.bk.post('/regulation/subjects', params).subscribe(dt => {
			this.subjects = Object.entries(dt.subjects)
			this.subjects = this.subjects.filter((x: any) => x[1].type != 'lab' && x[1].type != 'none')
		})
	}

	formData: FormData = new FormData()
	handleFileInput(event: any) {
		const fileToUpload = event.target.files.item(0)
		this.formData = new FormData()
		this.formData.append('file_to_upload', fileToUpload)
	}

	applyForRevaluation(params: any) {
		if (this.DU_number == '') {
			Swal.fire('Enter DU number', 'Please enter DU number', 'warning')
			return
		}
		params.subjects = {}
		for (const key of Object.keys(params)) {
			if (key.indexOf("code") == 0) {
				let subCode = key.split(" ")[1]
				if (params[key] != "") {
					params.subjects[subCode] = true
				}
				delete params[key]
			}
		}
		params.roll = this.roll
		params.regulation_ = this.regulation
		params.batch = this.user_data.batch
		params.DU_number = this.DU_number
		this.loading = true
		setTimeout(() => {
			this.store(params)
		}, 1000)

	}

	store(params: any) {
		this.formData.set('DU_number', this.DU_number)
		this.bk.upload("/upload/revaluation-receipt", this.formData).subscribe((event: any) => {
			if (event.body) {
				console.log(event.body.result[0].Location)
				params.receipt = event.body.result[0].Location
				console.log(params)
				this.bk.post('/student/applyforrevaluation', params).subscribe(result => {
					console.log(result)
					this.loading = false
					if (result.errno != undefined) {
						Swal.fire('status Failed', 'application submission failed', 'error')
					} else {
						Swal.fire('status success', 'application submission successfully', 'success')
							.then(() => {
								location.reload()
							})
					}
				})
			}
		})
	}

}
