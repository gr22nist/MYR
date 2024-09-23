import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CareerItem from './CareerItem';
// import DraggableList from '../../common/DraggableList';
import { addCareer, updateCareer, deleteCareer, loadCareers, saveCareers } from '@/redux/slices/careerSlice';
import { AddBtn } from '@/components/icons/IconSet';

const CareerList = () => {
	const careers = useSelector(state => state.careers.items);
	const status = useSelector(state => state.careers.status);
	const dispatch = useDispatch();

	useEffect(() => {
		if (status === 'idle') {
			dispatch(loadCareers());
		}
	}, [dispatch, status]);

	const handleCareerChange = useCallback((updatedCareer) => {
		dispatch(updateCareer(updatedCareer));
		dispatch(saveCareers(careers.map(career => career.id === updatedCareer.id ? updatedCareer : career)));
	}, [dispatch, careers]);

	const handleAddCareer = useCallback(() => {
		const newId = `career-${Date.now()}`;
		const newCareer = { 
			id: newId, 
			companyName: '', 
			position: '', 
			startDate: '', 
			endDate: '', 
			isCurrent: false, 
			tasks: '' 
		};
		dispatch(addCareer(newCareer));
		dispatch(saveCareers([...careers, newCareer]));
	}, [dispatch, careers]);

	const handleDeleteCareer = useCallback((id) => {
		console.log('Deleting career with id:', id); // 디버깅을 위한 로그
		if (careers.length > 1) {
			dispatch(deleteCareer(id));
			const updatedCareers = careers.filter(career => career.id !== id);
			console.log('Updated careers after deletion:', updatedCareers); // 디버깅을 위한 로그
			dispatch(saveCareers(updatedCareers));
		} else {
			console.log('Cannot delete the last career item'); // 디버깅을 위한 로그
		}
	}, [dispatch, careers]);

	return (
		<section className="career-list">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-extrabold">경력</h2>
				<button
					className="p-1 rounded-full"
					onClick={handleAddCareer}
				>
					<AddBtn className="fill-mono-99 hover:fill-secondary-dark hover:scale-110 duration-300" />
				</button>
			</div>
			{careers.length > 0 ? (
				<div>
					{careers.map((career) => (
						<CareerItem
							key={career.id}
							career={career}
							onCareerChange={handleCareerChange}
							onDelete={handleDeleteCareer}
							isDeletable={careers.length > 1}
							className=""
						/>
					))}
				</div>
			) : (
				<div>No careers added yet. Click the add button to create a new career item.</div>
			)}
		</section>
	);
};

export default CareerList;