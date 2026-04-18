import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../src/components/button';
import { Icon } from './Icon';

const meta = {
	title: 'Foundations/Iconografía',
	parameters: {
		layout: 'centered',
		a11y: { disable: true },
		test: { skip: true },
	},
	decorators: [
		(Story) => (
			<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta;

export default meta;

export const EstadoInformativo: StoryObj = {
	name: 'Estado informativo',
	tags: ['!dev'],
	render: () => (
		<Button variant="text" color="ink" size="sm" startIcon={<Icon name="infoSquare" />}>
			Mensaje informativo
		</Button>
	),
};

export const AccionCorrecta: StoryObj = {
	name: 'Acción correcta',
	tags: ['!dev'],
	render: () => (
		<Button color="sea" size="sm" startIcon={<Icon name="plusCircle"/>}>
			Crear registro
		</Button>
	),
};

export const SoporteSemantico: StoryObj = {
	name: 'Soporte semántico',
	tags: ['!dev'],
	render: () => (
		<Button variant="outlined" color="ink" size="sm" startIcon={<Icon name="archive"/>}>
			Historial archivado
		</Button>
	),
};

export const IconoSinNecesidad: StoryObj = {
	name: 'Icono sin necesidad',
	tags: ['!dev'],
	render: () => (
		<Button variant="outlined" color="ink" size="sm" startIcon={<Icon name="warningFilled"/>}>
			Informacion general
		</Button>
	),
};

export const SemanticaEquivocada: StoryObj = {
	name: 'Semántica equivocada',
	tags: ['!dev'],
	render: () => (
		<Button color="pine" size="sm" startIcon={<Icon name="xSquare"/>}>
			Guardar cambios
		</Button>
	),
};

export const SaturacionVisual: StoryObj = {
	name: 'Saturación visual',
	tags: ['!dev'],
	render: () => (
		<Button
			color="brick"
			size="sm"
			startIcon={<Icon name="closeBold"/>}
            endIcon={<Icon name="warningFilled"/>}
		>
			Eliminar elemento
		</Button>
	),
};
