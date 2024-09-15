import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CareerItem from './CareerItem';
import DraggableList from '../../common/DraggableList';
import { addCareer, updateCareer, deleteCareer, reorderCareers } from '@/redux/slices/careerSlice';
import { useCareerDB } from '@/hooks/useIndexedDB';

const CareerList = () => {
	const careers = useSelector(state => state.careers);
	const dispatch = useDispatch();
	const { fetchCareers, saveCareersToDb } = useCareerDB();

	useEffect(() => {
		fetchCareers();
	}, [fetchCareers]);

	useEffect(() => {
		if (careers.length > 0) {
			saveCareersToDb(careers);
		}
	}, [careers, saveCareersToDb]);

	const handleCareerChange = (updatedCareer) => {
		dispatch(updateCareer(updatedCareer));
	};

	const handleAddCareer = () => {
		dispatch(addCareer({ id: Date.now(), companyName: '', position: '', period: '', tasks: '' }));
	};

	const handleDeleteCareer = (id) => {
		dispatch(deleteCareer(id));
	};

	const onDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(careers);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		dispatch(reorderCareers(items));
	};

	return (
		<div className="career-list">
			<h2 className="text-xl font-bold mb-4">경력</h2>
			<DraggableList
				items={careers}
				onDragEnd={onDragEnd}
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
			
			{/* 경력 추가 버튼 */}
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