import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CareerItem from './CareerItem';
import DraggableList from '../../common/DraggableList';
import { addCareer, updateCareer, deleteCareer, reorderCareers, setCareers } from '@/redux/slices/careerSlice';
import { useCareerDB } from '@/hooks/useCareerDB';

const CareerList = () => {
	const careersFromState = useSelector(state => state.careers);
	const careers = useMemo(() => careersFromState || [], [careersFromState]);
	const dispatch = useDispatch();
	const { fetchCareers, saveCareersToDb } = useCareerDB();
	const initialLoadDone = useRef(false);

	useEffect(() => {
		const loadCareers = async () => {
			if (!initialLoadDone.current) {
				try {
					let loadedCareers = await fetchCareers();
					if (!loadedCareers || loadedCareers.length === 0) {
						loadedCareers = [{
							id: `career-${Date.now()}`,
							companyName: '',
							position: '',
							period: '',
							tasks: ''
						}];
					}
					dispatch(setCareers(loadedCareers));
				} catch (error) {
					console.error('Failed to load careers:', error);
				} finally {
					initialLoadDone.current = true;
				}
			}
		};

		loadCareers();
	}, [fetchCareers, dispatch]);

	useEffect(() => {
		if (initialLoadDone.current && careers.length > 0) {
			const saveTimeout = setTimeout(() => {
				saveCareersToDb(careers);
			}, 500);

			return () => clearTimeout(saveTimeout);
		}
	}, [careers, saveCareersToDb]);

	const handleCareerChange = useCallback((updatedCareer) => {
		dispatch(updateCareer(updatedCareer));
	}, [dispatch]);

	const handleAddCareer = useCallback(() => {
		const newId = `career-${Date.now()}`;
		dispatch(addCareer({ id: newId, companyName: '', position: '', period: '', tasks: '' }));
	}, [dispatch]);

	const handleDeleteCareer = useCallback((id) => {
		dispatch(deleteCareer(id));
	}, [dispatch]);

	const onDragEnd = useCallback((result) => {
		if (!result.destination) return;

		const items = Array.from(careers);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		dispatch(reorderCareers(items));
	}, [careers, dispatch]);

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