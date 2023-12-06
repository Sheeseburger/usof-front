// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostPage from './pages/PostsPage';
import SinglePostPage from './pages/PostPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import ProtectedRoutes from './utils/protectedRoutes';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProfilePage from './pages/profilePage';
import CreatePost from './pages/createPost';
import TagPage from './pages/TagPage';
function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/register" element={<SignUp />} />
					<Route path="/login" element={<SignIn />} />
					<Route path="/forgotPassword" element={<ForgotPasswordPage />} />
					<Route path="/forgotPassword/:token" element={<ForgotPasswordPage />} />
					<Route index element={<PostPage />} />
					<Route path="/" element={<PostPage />} />
					<Route path="/tags" element={<TagPage />} />
					<Route element={<ProtectedRoutes />}>
						<Route path="/create-post" element={<CreatePost />} />
						<Route path="/create-post/:id" element={<CreatePost />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/profile/:id" element={<ProfilePage />} />
						<Route path="/posts/:postId" element={<SinglePostPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
