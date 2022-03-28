export const Authentication = {
	saveToken(studentToken) {
		localStorage.setItem('token', studentToken);
	},

	getToken() {
		const studentToken = localStorage.getItem('token');
		return studentToken;
	},

	removeToken() {
		localStorage.removeItem('token');
	},
};
// export default Authentication;
