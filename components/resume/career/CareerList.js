import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CareerItem from './CareerItem';
import DraggableList from '../../common/DraggableList';
import { addCareer, updateCareer, deleteCareer, loadCareers, saveCareers } from '@/redux/slices/careerSlice';

const CareerList = () => {
	const careers = useSelector(state => state.careers.items);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadCareers());
	}, [dispatch]);

	const handleCareerChange = useCallback((updatedCareer) => {
		dispatch(updateCareer(updatedCareer));
		dispatch(saveCareers(careers.map(career => career.id === updatedCareer.id ? updatedCareer : career)));
	}, [dispatch, careers]);

	const handleAddCareer = useCallback(() => {
		const newId = `career-${Date.now()}`;
		const newCareer = { id: newId, companyName: '', position: '', period: '', tasks: '' };
		dispatch(addCareer(newCareer));
		dispatch(saveCareers([...careers, newCareer]));
	}, [dispatch, careers]);

	const handleDeleteCareer = useCallback((id) => {
		if (careers.length > 1) {
			dispatch(deleteCareer(id));
			dispatch(saveCareers(careers.filter(career => career.id !== id)));
		}
	}, [dispatch, careers]);

	return (
		<div className="career-list">
			<h2 className="text-xl font-bold mb-4">경력</h2>
			<DraggableList
				items={careers}
				renderItem={(career) => (
					<CareerItem
						key={career.id}
						career={career}
						onCareerChange={handleCareerChange}
						onDelete={() => handleDeleteCareer(career.id)}
						isDeletable={careers.length > 1}
					/>
				)}
			/>
			<div className="mt-4 flex justify-center">
				<button
					className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"
					onClick={handleAddCareer}
				>
					+
				</button>
			</div>
		</div>
	);
};

export default CareerList;