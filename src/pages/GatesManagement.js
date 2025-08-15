import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { gatesAPI } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { DoorOpen, Plus, Edit, Trash2, Search, ArrowLeft } from "lucide-react";

const GatesManagementPage = () => {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGate, setEditingGate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    fetchGates();
  }, []);

  const fetchGates = async () => {
    setLoading(true);
    try {
      const response = await gatesAPI.getAll();
      setGates(response.data.data);
    } catch {
      toast.error("خطأ في جلب البوابات");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingGate) {
        await gatesAPI.update(editingGate._id, data);
        toast.success("تم تحديث البوابة بنجاح");
      } else {
        await gatesAPI.create(data);
        toast.success("تم إضافة البوابة بنجاح");
      }
      reset();
      setShowForm(false);
      setEditingGate(null);
      fetchGates();
    } catch (error) {
      toast.error(error.response?.data?.message || "خطأ في العملية");
    }
  };

  const handleEdit = (gate) => {
    setEditingGate(gate);
    setValue("name", gate.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه البوابة؟")) return;
    try {
      await gatesAPI.delete(id);
      toast.success("تم حذف البوابة بنجاح");
      fetchGates();
    } catch {
      toast.error("خطأ في حذف البوابة");
    }
  };

  const cancelForm = () => {
    reset();
    setEditingGate(null);
    setShowForm(false);
  };

  const filteredGates = gates.filter((gate) =>
    gate.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="mr-3"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                رجوع
              </Button>
              <div className="bg-teal-600 p-2 rounded-lg">
                <DoorOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mr-3">
                إدارة البوابات
              </h1>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة بوابة جديدة
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <Card title={editingGate ? "تعديل البوابة" : "إضافة بوابة جديدة"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="اسم البوابة"
                  placeholder="اسم البوابة"
                  error={errors.name?.message}
                  {...register("name", { required: "اسم البوابة مطلوب" })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={cancelForm}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingGate ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <>
            {/* Search */}
            <div className="mb-6">
              <Card>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البحث
                </label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="البحث بالاسم"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </Card>
            </div>

            {/* Gates List */}
            <Card title={`البوابات (${filteredGates.length})`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGates.map((gate) => (
                  <div
                    key={gate._id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <DoorOpen className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(gate)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(gate._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {gate.name}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
                      <span className="text-gray-500">تاريخ الإنشاء:</span>
                      <span className="text-gray-900">
                        {new Date(gate.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGates.length === 0 && (
                <div className="text-center py-8">
                  <DoorOpen className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا يوجد بوابات</p>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default GatesManagementPage;
